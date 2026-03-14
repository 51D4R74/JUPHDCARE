import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { devNow } from "@shared/dev-clock";
import {
  Sun, ChevronRight, Activity, BookOpen, Target, Lightbulb,
  Heart, Trophy, Settings, CheckCircle2,
  Sparkles,
  Shield,
  FileText,
  Bell,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import AnimatedBrandLogo from "@/components/animated-brand-logo";
import { SKY_CONFIG } from "@/components/sky-header";
import SolarPointsBadge from "@/components/solar-points-badge";
import NotificationBadge from "@/components/notification-badge";
import NotificationDrawer from "@/components/notification-drawer";
import InlineCheckin from "@/components/inline-checkin";
import ConstancyDots from "@/components/constancy-dots";
import { useAuth } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { fetchCurrentRelationalPulse, submitRelationalPulse } from "@/lib/pulse-client";
import { type TodayScores, getDomainMeta, computeBaseline } from "@/lib/score-engine";
import { DAILY_STEPS, type ScoreDomainId } from "@/lib/checkin-data";
import { computeDiscoveries, DISCOVERY_MIN_RECORDS } from "@/lib/discovery-engine";
import { POINT_VALUES } from "@/lib/mission-engine";
import { fetchCurrentChallenge, buildOfflineSnapshot, describeChallenge, type TeamChallengeSnapshot } from "@/lib/team-challenge-engine";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserMission, CheckInHistoryRecord } from "@shared/schema";
import { PULSE_DIMENSION_LABELS, PULSE_RESPONSE_OPTIONS, type CurrentPulseState, type PulseAnswerValue } from "@shared/pulse-survey";

type QuickAction = (typeof QUICK_ACTIONS)[number];

function getDailyInsight(scores: TodayScores): string {
  if (!scores.hasCheckedIn) {
    return "Seu check-in de hoje ativa scores, missões e sinais — leva menos de 1 minuto.";
  }

  if (scores.flags.includes("harassment_signal")) {
    return "Sinal de proteção relacional detectado — cuide de você primeiro, a trilha de apoio está ali.";
  }

  const orderedDomains = [
    { id: "recarga", score: scores.domainScores.recarga },
    { id: "estado-do-dia", score: scores.domainScores["estado-do-dia"] },
    { id: "seguranca-relacional", score: scores.domainScores["seguranca-relacional"] },
  ].toSorted((left, right) => left.score - right.score);
  const lowest = orderedDomains[0];

  if (lowest.id === "recarga") {
    return lowest.score < 50
      ? "⚡ Sua bateria tá pedindo um respiro — missões curtinhas valem ouro hoje."
      : "🔋 Recarga estável — mantenha pausas pra proteger esse ritmo.";
  }

  if (lowest.id === "estado-do-dia") {
    return lowest.score < 50
      ? "🌡️ Dia mais sensível — comece por algo leve, sem pressa."
      : "✨ Dia com energia — bom momento pra avançar no que importa.";
  }

  return lowest.score < 50
    ? "🛡️ Contexto relacional pede cuidado — prefira interações previsíveis hoje."
    : "🤝 Contexto relacional tranquilo — bom momento pra conversas importantes.";
}

// ── Celebration particles ─────────────────────────

const CELEBRATION_PARTICLES = [
  { angle: 0, distance: 44, delay: 0 },
  { angle: 45, distance: 38, delay: 0.05 },
  { angle: 90, distance: 46, delay: 0.02 },
  { angle: 135, distance: 40, delay: 0.08 },
  { angle: 180, distance: 44, delay: 0.03 },
  { angle: 225, distance: 36, delay: 0.07 },
  { angle: 270, distance: 42, delay: 0.01 },
  { angle: 315, distance: 39, delay: 0.04 },
] as const;

function CelebrationParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {CELEBRATION_PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={p.angle}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.2, x, y }}
            transition={{ duration: 0.75, delay: p.delay, ease: "easeOut" }}
            className={`absolute left-1/2 top-1/2 rounded-full ${
              i % 2 === 0 ? "h-1.5 w-1.5 bg-brand-gold" : "h-1 w-1 bg-warmth-coral"
            }`}
          />
        );
      })}
    </div>
  );
}

// ── Score color helpers ───────────────────────────

const SCORE_TIERS = [
  { min: 70, label: "text-score-good", bg: "bg-score-good/15" },
  { min: 40, label: "text-score-moderate", bg: "bg-score-moderate/15" },
  { min: 0, label: "text-score-attention", bg: "bg-score-attention/15" },
] as const;

function scoreColorClass(score: number): { text: string; bg: string } {
  const tier = SCORE_TIERS.find((t) => score >= t.min) ?? SCORE_TIERS.at(-1)!;
  return { text: tier.label, bg: tier.bg };
}

const EMPTY_SCORES: TodayScores = {
  domainScores: { recarga: 0, "estado-do-dia": 0, "seguranca-relacional": 0 },
  skyState: "partly-cloudy",
  solarHaloLevel: 0.5,
  flags: [],
  hasCheckedIn: false,
};

const QUICK_ACTIONS = [
  {
    label: "Check-in diário",
    description: "Conta como foi o dia",
    icon: Activity,
    action: "route",
    target: "/checkin",
  },
  {
    label: "Apoio",
    description: "Cuidado e acolhimento",
    icon: Heart,
    action: "route",
    target: "/support",
  },
  {
    label: "Proteção",
    description: "Relatar algo sério",
    icon: Shield,
    action: "route",
    target: "/protecao",
  },
  {
    label: "Relatório",
    description: "Sua história em números",
    icon: FileText,
    action: "route",
    target: "/report",
  },
  {
    label: "Notificações",
    description: "O que há de novo",
    icon: Bell,
    action: "drawer",
  },
  {
    label: "Configurações",
    description: "Ajustar a experiência",
    icon: Settings,
    action: "route",
    target: "/settings",
  },
] as const;

function formatShortDate(date: string | null): string {
  if (date === null) {
    return "agora";
  }

  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function getPulseLeadText(state: CurrentPulseState): string {
  if (state.isDue) {
    return `Janela aberta até ${formatShortDate(state.window.windowEnd)}.`;
  }

  return `Próxima janela prevista para ${formatShortDate(state.nextEligibleAt)}.`;
}

function getPulseCompletionCount(
  answers: Readonly<Record<string, PulseAnswerValue>>,
  questionIds: readonly string[],
): number {
  return questionIds.filter((questionId) => answers[questionId] !== undefined).length;
}

function getHeaderBadgeLabel(scores: TodayScores): string {
  return SKY_CONFIG[scores.skyState].label;
}

function getCheckInStatusCopy(justCompleted: boolean): { title: string; description: string } {
  if (justCompleted) {
    return {
      title: "Registrado! Seus sinais estão atualizados.",
      description: "Tudo certo por hoje.",
    };
  }

  return {
      title: "Tudo certo por hoje",
      description: "Seus scores estão atualizados.",
  };
}

function getPulseCardTone(isDue: boolean): { container: string; badge: string; icon: string } {
  if (isDue) {
    return {
      container: "border-brand-teal/20 hover:border-brand-teal/35 hover:bg-brand-teal/5",
      badge: "bg-brand-teal/12 text-brand-teal",
      icon: "bg-brand-teal/12 text-brand-teal",
    };
  }

  return {
    container: "border-border/70",
    badge: "bg-primary/8 text-primary",
    icon: "bg-primary/8 text-primary",
  };
}

function DashboardHeader({
  firstName,
  scores,
  solarPoints,
  onOpenNotifications,
  onOpenSettings,
}: Readonly<{
  firstName: string;
  scores: TodayScores;
  solarPoints: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}>) {
  return (
    <header className="max-w-lg mx-auto px-4 pt-5">
      {/* Slim controls bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <AnimatedBrandLogo size="compact" showWordmark={false} />
        <div className="flex items-center gap-2">
          <SolarPointsBadge points={solarPoints} />
          <NotificationBadge onClick={onOpenNotifications} />
          <button
            onClick={onOpenSettings}
            className="rounded-full border border-border/80 bg-card p-1.5 shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5"
            aria-label="Configurações"
          >
            <Settings className="w-4 h-4 text-foreground/72" />
          </button>
        </div>
      </motion.div>

      {/* Hero greeting — breathing space */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mt-7 text-center"
      >
        <p className="text-[34px] font-semibold leading-tight tracking-[-0.04em] text-foreground">
          {getGreeting()}, {firstName}
        </p>
        <p className="mx-auto mt-2.5 max-w-[20rem] text-base leading-relaxed text-muted-foreground/90">
          Como você está hoje?
        </p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mt-4 inline-flex items-center gap-1 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-primary/80"
        >
          {getHeaderBadgeLabel(scores)}
        </motion.span>
      </motion.div>
    </header>
  );
}

function PulseCard({
  pulseState,
  onOpen,
}: Readonly<{
  pulseState: CurrentPulseState;
  onOpen: () => void;
}>) {
  const tone = getPulseCardTone(pulseState.isDue);
  const pulseDimensionEntries = pulseState.latestResponse
    ? Object.entries(pulseState.latestResponse.scoreSummary.dimensionScores)
    : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.43 }}
      className="mt-4"
    >
      <button
        type="button"
        onClick={onOpen}
        className={`w-full rounded-2xl border bg-card px-4 py-4 text-left shadow-sm transition-colors ${tone.container}`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Leitura mensal
                </p>
                <p className="mt-1 text-base font-semibold tracking-[-0.02em] text-foreground">
                  {pulseState.definition.title}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.badge}`}>
                {pulseState.isDue ? "Disponível" : "Concluído"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {getPulseLeadText(pulseState)} {pulseState.definition.questions.length} itens, cerca de {Math.round(pulseState.definition.estimatedSeconds / 60)} minuto.
            </p>

            {pulseState.latestResponse && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-border/60 bg-background px-3 py-2.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Seu último score
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {pulseState.latestResponse.scoreSummary.overallScore}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Respondido em {formatShortDate(pulseState.latestResponse.windowStart)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background px-3 py-2.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Pontos solares
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    +{POINT_VALUES.pulseSurvey}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ao responder
                  </p>
                </div>
              </div>
            )}

            {pulseDimensionEntries.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pulseDimensionEntries.map(([dimension, score]) => (
                  <span
                    key={dimension}
                    className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {PULSE_DIMENSION_LABELS[dimension as keyof typeof PULSE_DIMENSION_LABELS]}: {score}
                  </span>
                ))}
              </div>
            )}

            {pulseState.isDue && (
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-teal">
                <span>Responder agora</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </button>
    </motion.section>
  );
}

function QuickAccessSection({
  quickActions,
  onSettings,
  onQuickAction,
}: Readonly<{
  quickActions: readonly QuickAction[];
  onSettings: () => void;
  onQuickAction: (action: QuickAction) => void;
}>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.52 }}
      className="mt-4 rounded-3xl border border-border/70 bg-card px-4 py-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
            Para você agora
          </h2>
        </div>
        <button
          type="button"
          onClick={onSettings}
          className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
        >
          Ajustar
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => onQuickAction(action)}
              className="rounded-2xl border border-border/65 bg-background px-3 py-3 text-left transition-colors hover:border-primary/20 hover:bg-primary/5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-[-0.02em] text-foreground">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}

function DashboardBottomNav({
  onNavigate,
}: Readonly<{
  onNavigate: (path: string) => void;
}>) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 glass-card border-t border-border/30">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
        <button
          onClick={() => onNavigate("/dashboard")}
          className="flex flex-col items-center gap-1 text-primary"
          data-testid="nav-home"
        >
          <Sun className="w-5 h-5" />
          <span className="text-xs font-medium">Início</span>
        </button>
        <button
          onClick={() => onNavigate("/checkin")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="nav-checkin"
        >
          <Activity className="w-5 h-5" />
          <span className="text-xs">Check-in</span>
        </button>
        <button
          onClick={() => onNavigate("/missions")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="nav-missions"
        >
          <Target className="w-5 h-5" />
          <span className="text-xs">+Você</span>
        </button>
        <button
          onClick={() => onNavigate("/support")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="nav-support"
        >
          <Heart className="w-5 h-5" />
          <span className="text-xs">Apoio</span>
        </button>
        <button
          onClick={() => onNavigate("/meu-cuidado")}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="nav-jornada"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs">Jornada</span>
        </button>
      </div>
    </nav>
  );
}

function getGreeting(): string {
  const hour = devNow().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pulseDialogOpen, setPulseDialogOpen] = useState(false);
  const [pulseAnswers, setPulseAnswers] = useState<Record<string, PulseAnswerValue>>({});
  // Track local completion to show celebration immediately (before server refetch)
  const [justCompleted, setJustCompleted] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<ScoreDomainId | null>(null);

  const { data: scores = EMPTY_SCORES } = useQuery<TodayScores>({
    queryKey: ["/api/scores/user", userId, "today"],
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });

  const { data: todayMissions = [] } = useQuery<UserMission[]>({
    queryKey: ["/api/missions", userId, "today"],
    enabled: !!userId,
  });

  const { data: history = [] } = useQuery<CheckInHistoryRecord[]>({
    queryKey: ["/api/checkins/user", userId, "history"],
    queryFn: () =>
      fetch(`/api/checkins/user/${userId}/history?days=10`, { credentials: "include" })
        .then((r) => r.json()) as Promise<CheckInHistoryRecord[]>,
    enabled: !!userId,
  });

  const { data: discoveryHistory = [] } = useQuery<CheckInHistoryRecord[]>({
    queryKey: ["/api/checkins/user", userId, "discovery-history"],
    queryFn: () =>
      fetch(`/api/checkins/user/${userId}/history?days=30`, { credentials: "include" })
        .then((r) => r.json()) as Promise<CheckInHistoryRecord[]>,
    enabled: !!userId,
  });

  const { data: teamChallenge = buildOfflineSnapshot() } = useQuery<TeamChallengeSnapshot>({
    queryKey: ["/api/team-challenges/current"],
    queryFn: fetchCurrentChallenge,
  });

  const { data: pulseState } = useQuery<CurrentPulseState>({
    queryKey: ["/api/pulses/user", userId, "current"],
    queryFn: () => fetchCurrentRelationalPulse(userId),
    enabled: !!userId,
  });

  const checkedInDates = history.map((h) => h.date);

  const checkedIn = scores.hasCheckedIn || justCompleted;
  const isFirstVisit = !checkedIn && history.length === 0;
  const CRISIS_THRESHOLD = 25;
  const hasCrisisSignal = checkedIn && Object.values(scores.domainScores).some(
    (s) => s < CRISIS_THRESHOLD,
  );

  const missionPointsToday = todayMissions.reduce((sum, m) => sum + m.pointsEarned, 0);
  const solarPoints = (checkedIn ? POINT_VALUES.checkin : 0) + missionPointsToday;

  useEffect(() => {
    if (pulseDialogOpen) {
      setPulseAnswers({});
    }
  }, [pulseDialogOpen, pulseState?.window.windowStart]);

  const submitPulseMutation = useMutation({
    mutationFn: async () => {
      if (!pulseState?.isDue) {
        throw new Error("Pulse indisponível neste momento.");
      }

      await submitRelationalPulse({
        userId,
        windowStart: pulseState.window.windowStart,
        windowEnd: pulseState.window.windowEnd,
        answers: pulseState.definition.questions.map((question) => ({
          questionId: question.id,
          value: pulseAnswers[question.id],
        })),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/pulses/user", userId, "current"] });
      setPulseDialogOpen(false);
      setPulseAnswers({});
      toast({
        title: "Pulse registrado",
        description: `Leitura mensal concluída. Você ganhou ${POINT_VALUES.pulseSurvey} pontos solares.`,
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof Error
        ? error.message.replace(/^\d+:\s*/, "")
        : "Não foi possível registrar o pulse agora.";
      toast({
        title: "Erro ao enviar pulse",
        description,
        variant: "destructive",
      });
    },
  });

  const handleCheckinComplete = useCallback(() => {
    setJustCompleted(true);
  }, []);

  const handlePulseAnswer = useCallback((questionId: string, value: PulseAnswerValue) => {
    setPulseAnswers((current) => ({ ...current, [questionId]: value }));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Colaborador";

  const domains = useMemo(() => getDomainMeta(), []);
  const discoveries = useMemo(() => computeDiscoveries(discoveryHistory), [discoveryHistory]);
  const baseline = useMemo(() => computeBaseline(discoveryHistory), [discoveryHistory]);
  const featuredDiscovery = discoveries.length > 0 ? discoveries[0] : null;
  const discoveryProgress = discoveryHistory.length;
  const pulseQuestionIds = pulseState?.definition.questions.map((question) => question.id) ?? [];
  const pulseAnsweredCount = getPulseCompletionCount(pulseAnswers, pulseQuestionIds);
  const canSubmitPulse = pulseState?.isDue === true
    && pulseAnsweredCount === pulseQuestionIds.length
    && pulseQuestionIds.length > 0;
  const checkInStatusCopy = getCheckInStatusCopy(justCompleted);

  const contextualActions = useMemo(() => {
    const actions = [...QUICK_ACTIONS];
    if (checkedIn) {
      const idx = actions.findIndex((a) => "target" in a && a.target === "/checkin");
      if (idx >= 0) actions.push(...actions.splice(idx, 1));
    }
    if (hasCrisisSignal) {
      const idx = actions.findIndex((a) => "target" in a && a.target === "/support");
      if (idx > 0) actions.unshift(...actions.splice(idx, 1));
    }
    return actions;
  }, [checkedIn, hasCrisisSignal]);

  const handleQuickAction = useCallback((action: (typeof QUICK_ACTIONS)[number]) => {
    if (action.action === "drawer") {
      setDrawerOpen(true);
      return;
    }

    navigate(action.target);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-sunrise">
      <DashboardHeader
        firstName={firstName}
        scores={scores}
        solarPoints={solarPoints}
        onOpenNotifications={() => setDrawerOpen(true)}
        onOpenSettings={() => navigate("/settings")}
      />

      <AnimatePresence>
        {drawerOpen && (
          <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-24 pt-3">
        {/* Constancy dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <ConstancyDots checkedInDates={checkedInDates} />
        </motion.div>

        {/* Score contributors — expandable Oura pattern */}
        {checkedIn && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-4 space-y-2"
          >
            {domains.map((d) => {
              const score = Math.round(scores.domainScores[d.id] ?? 0);
              const colors = scoreColorClass(score);
              const isOpen = expandedDomain === d.id;
              const contributors = DAILY_STEPS.filter((s) => d.questionIds.includes(s.id));

              return (
                <div key={d.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedDomain(isOpen ? null : d.id)}
                    className={`w-full rounded-2xl border border-border/60 px-4 py-3 text-left transition-colors hover:border-primary/20 ${colors.bg}`}
                    aria-expanded={isOpen}
                    aria-label={`${d.label}: ${score}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold tracking-[-0.01em] ${colors.text}`}>
                        {d.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold leading-none ${colors.text}`}>{score}</span>
                        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-border/50 bg-card px-4 py-3 mt-1 space-y-2.5">
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {d.description}
                          </p>
                          {contributors.map((step) => (
                            <div key={step.id} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                              <span className="text-sm text-foreground/80">{step.question}</span>
                            </div>
                          ))}
                          {baseline?.[d.id] && (
                            <div className="rounded-xl border border-border/40 bg-background px-3 py-2">
                              <p className="text-[11px] font-medium text-muted-foreground tracking-wide">
                                Sua faixa típica
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <div className="relative h-1.5 flex-1 rounded-full bg-primary/10 overflow-hidden">
                                  <div
                                    className="absolute h-full rounded-full bg-primary/30"
                                    style={{
                                      left: `${baseline[d.id].low}%`,
                                      width: `${baseline[d.id].high - baseline[d.id].low}%`,
                                    }}
                                  />
                                  <div
                                    className="absolute h-3 w-0.5 -top-[3px] rounded-full bg-foreground"
                                    style={{ left: `${score}%` }}
                                  />
                                </div>
                                <span className="text-[11px] tabular-nums text-muted-foreground">
                                  {baseline[d.id].low}–{baseline[d.id].high}
                                </span>
                              </div>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => navigate("/meu-cuidado")}
                            className="flex items-center gap-1 text-xs font-medium text-primary pt-1"
                          >
                            Ver histórico completo
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.section>
        )}

        {/* First-visit welcome */}
        {isFirstVisit && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 rounded-2xl border border-primary/10 bg-card p-5 text-center shadow-sm"
          >
            <p className="text-xl font-semibold tracking-[-0.03em]">Boas-vindas à Lumina</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Seu primeiro check-in leva menos de 1 minuto. Vamos?
            </p>
          </motion.section>
        )}

        {/* Inline check-in OR post-check-in celebration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          {checkedIn ? (
            <motion.div
              initial={justCompleted ? { scale: 0.92, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative flex items-center gap-3 rounded-2xl border border-score-good/20 bg-card p-4 shadow-sm"
            >
              {justCompleted && <CelebrationParticles />}
              <motion.div
                initial={justCompleted ? { rotate: -90, scale: 0 } : false}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-score-good/12"
              >
                {justCompleted ? (
                  <Sparkles className="w-5 h-5 text-score-good" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-score-good" />
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
                  {checkInStatusCopy.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {checkInStatusCopy.description}
                </p>
              </div>
            </motion.div>
          ) : (
            <InlineCheckin
              userId={userId}
              onComplete={handleCheckinComplete}
              onNavigateProtection={() => navigate("/protecao")}
            />
          )}
        </motion.section>

        {/* Insight do dia — condensed, only after check-in */}
        {checkedIn && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 rounded-2xl border border-primary/10 bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gold/14">
                <Lightbulb className="h-4 w-4 text-brand-gold-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Insight do dia
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">
                  {getDailyInsight(scores)}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Discovery card — 1 private insight from correlation engine */}
        {checkedIn && featuredDiscovery && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="mt-4 rounded-2xl border border-brand-teal/15 bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-teal/12">
                <Sparkles className="h-4 w-4 text-brand-teal" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Descoberta privada
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">
                  {featuredDiscovery.text}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground/70">
                  Baseado em {featuredDiscovery.withCount} dias · Só você vê isso
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Discovery progress teaser — before threshold */}
        {checkedIn && !featuredDiscovery && discoveryProgress > 0 && discoveryProgress < DISCOVERY_MIN_RECORDS && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="mt-4 rounded-2xl border border-border/60 bg-card px-4 py-3.5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8">
                <Sparkles className="h-3.5 w-3.5 text-primary/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {DISCOVERY_MIN_RECORDS - discoveryProgress} check-in{DISCOVERY_MIN_RECORDS - discoveryProgress > 1 ? "s" : ""} até sua primeira descoberta privada
                </p>
                <div className="mt-1.5 h-1 rounded-full bg-primary/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((discoveryProgress / DISCOVERY_MIN_RECORDS) * 100)}%` }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="h-full rounded-full bg-primary/40"
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {pulseState && (
          <PulseCard
            pulseState={pulseState}
            onOpen={() => {
              if (pulseState.isDue) {
                setPulseDialogOpen(true);
              }
            }}
          />
        )}

        {/* Crisis-aware support CTA */}
        {hasCrisisSignal && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-3"
          >
            <button
              onClick={() => navigate("/support")}
              className="flex w-full items-center gap-3 rounded-2xl border border-score-attention/20 bg-card p-4 text-left shadow-sm transition-colors hover:border-score-attention/30"
              data-testid="button-crisis-support"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-score-attention/14">
                <Heart className="w-5 h-5 text-score-attention" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold tracking-[-0.02em]">Tô aqui se precisar.</p>
                <p className="text-sm text-muted-foreground">
                  Apoio e acolhimento quando quiser
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          </motion.section>
        )}

        {/* Activity tiles — 2-column mosaic */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => navigate("/missions")}
            className="rounded-2xl border border-primary/10 bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/20"
            data-testid="button-missions"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Target className="w-[18px] h-[18px] text-primary" />
            </div>
            <p className="text-base font-semibold tracking-[-0.02em]">+Você</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Autocuidado e Pontos Solares
            </p>
          </button>
          <button
            onClick={() => navigate("/team")}
            className="rounded-2xl border border-brand-gold/14 bg-card p-4 text-left shadow-sm transition-colors hover:border-brand-gold/24"
            data-testid="button-team-challenge"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10">
              <Trophy className="w-[18px] h-[18px] text-brand-gold-dark" />
            </div>
            <p className="text-base font-semibold tracking-[-0.02em]">{teamChallenge.template.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {describeChallenge(teamChallenge.progressPct, teamChallenge.daysRemaining)}
            </p>
          </button>
        </motion.section>

        <QuickAccessSection
          quickActions={contextualActions}
          onSettings={() => navigate("/settings")}
          onQuickAction={handleQuickAction}
        />

        {/* Minha Jornada — tertiary (minimal inline link) */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-3"
        >
          <button
            onClick={() => navigate("/meu-cuidado")}
            className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 text-left shadow-sm transition-colors hover:border-brand-teal/20 hover:bg-brand-teal/5"
            data-testid="button-meu-cuidado"
          >
            <BookOpen className="w-4 h-4 text-brand-teal flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground">Minha Jornada</span>
            <span className="text-sm text-muted-foreground">Histórico e tendências</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto flex-shrink-0" />
          </button>
        </motion.section>
      </main>

      {pulseState && (
        <Dialog open={pulseDialogOpen} onOpenChange={setPulseDialogOpen}>
          <DialogContent className="max-w-2xl rounded-3xl border-border/70 px-0 pb-0 pt-0 sm:max-w-xl">
            <DialogHeader className="border-b border-border/60 px-6 py-5">
              <DialogTitle>{pulseState.definition.title}</DialogTitle>
              <DialogDescription>
                Responda pensando nas últimas duas semanas. A leitura é privada e ajuda a calibrar os sinais diários do aplicativo.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/60 bg-background px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Progresso do pulse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pulseAnsweredCount} de {pulseQuestionIds.length} itens respondidos
                  </p>
                </div>
                <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                  Até {formatShortDate(pulseState.window.windowEnd)}
                </span>
              </div>

              <div className="space-y-4 pb-5">
                {pulseState.definition.questions.map((question, index) => (
                  <section
                    key={question.id}
                    className="rounded-2xl border border-border/65 bg-background px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {PULSE_DIMENSION_LABELS[question.dimension]}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                          {index + 1}. {question.prompt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {PULSE_RESPONSE_OPTIONS.map((option) => {
                        const selected = pulseAnswers[question.id] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handlePulseAnswer(question.id, option.value)}
                            className={`rounded-2xl border px-3 py-3 text-left text-sm transition-colors ${selected ? "border-brand-teal/40 bg-brand-teal/10 text-foreground" : "border-border/60 bg-card text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground"}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <DialogFooter className="border-t border-border/60 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPulseDialogOpen(false)}
                disabled={submitPulseMutation.isPending}
              >
                Agora não
              </Button>
              <Button
                type="button"
                onClick={() => submitPulseMutation.mutate()}
                disabled={!canSubmitPulse || submitPulseMutation.isPending}
              >
                {submitPulseMutation.isPending ? "Enviando..." : "Concluir pulse"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <DashboardBottomNav onNavigate={navigate} />

    </div>
  );
}
