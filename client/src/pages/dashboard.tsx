import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, ChevronRight, Activity, Shield, Target, Lightbulb,
  Heart, Trophy, Settings, CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AnimatedBrandLogo from "@/components/animated-brand-logo";
import SkyHeader from "@/components/sky-header";
import ScoreCard, { type ScoreContributor } from "@/components/score-card";
import SolarPointsBadge from "@/components/solar-points-badge";
import NotificationBadge from "@/components/notification-badge";
import NotificationDrawer from "@/components/notification-drawer";
import InlineCheckin from "@/components/inline-checkin";
import { useAuth } from "@/lib/auth";
import { getDomainMeta, type TodayScores } from "@/lib/score-engine";
import { DAILY_STEPS, type ScoreDomainId } from "@/lib/checkin-data";
import { POINT_VALUES } from "@/lib/mission-engine";
import { getCurrentChallenge } from "@/lib/team-challenge-engine";
import type { UserMission } from "@shared/schema";

function getDailyInsight(scores: TodayScores): string {
  if (!scores.hasCheckedIn) {
    return "Seu check-in de hoje abre o mapa do dia: scores, missões e sinais de cuidado ficam mais precisos depois dele.";
  }

  if (scores.flags.includes("harassment_signal")) {
    return "Hoje apareceu um sinal de proteção relacional. Priorize segurança psicológica e use a trilha de apoio se algo estiver pesando no ambiente.";
  }

  const orderedDomains = [
    { id: "recarga", score: scores.domainScores.recarga },
    { id: "estado-do-dia", score: scores.domainScores["estado-do-dia"] },
    { id: "seguranca-relacional", score: scores.domainScores["seguranca-relacional"] },
  ].toSorted((left, right) => left.score - right.score);
  const lowestDomain = orderedDomains[0];

  if (lowestDomain.id === "recarga") {
    return lowestDomain.score < 50
      ? "Sua recarga está pedindo proteção de ritmo. Missões curtas e pausas restaurativas tendem a gerar mais valor hoje do que esforço extra."
      : "Sua recarga está estável. Manter pausas pequenas ao longo do dia ajuda a proteger esse nível até o fim do expediente.";
  }

  if (lowestDomain.id === "estado-do-dia") {
    return lowestDomain.score < 50
      ? "O estado do dia merece aterrissagem. Comece por uma missão simples para reduzir atrito e recuperar tração sem se sobrecarregar."
      : "Seu estado do dia está responsivo. Vale aproveitar essa janela para avançar no que exige foco antes da energia oscilar.";
  }

  return lowestDomain.score < 50
    ? "A segurança relacional está mais sensível hoje. Prefira interações previsíveis e registre sinais do contexto antes que eles virem ruído contínuo."
    : "O contexto relacional parece mais estável. Esse é um bom momento para sustentar conversas objetivas e preservar clareza no ambiente.";
}

/** Build ScoreContributor list for a domain from stored answers. */
function buildContributors(domainId: ScoreDomainId, scores: TodayScores): ScoreContributor[] {
  if (!scores.hasCheckedIn) return [];
  const meta = getDomainMeta().find((d) => d.id === domainId);
  if (!meta) return [];

  return meta.questionIds.map((qId) => {
    const step = DAILY_STEPS.find((s) => s.id === qId);
    if (!step || step.type === "tags") return null;
    return {
      label: step.question.replace(/\?$/, "").slice(0, 40),
      value: 1, // placeholder — individual question scores not stored separately
      maxValue: 1,
    } satisfies ScoreContributor;
  }).filter(Boolean) as ScoreContributor[];
}

const EMPTY_SCORES: TodayScores = {
  domainScores: { recarga: 0, "estado-do-dia": 0, "seguranca-relacional": 0 },
  skyState: "partly-cloudy",
  solarHaloLevel: 0.5,
  flags: [],
  hasCheckedIn: false,
};

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Track local completion to show celebration immediately (before server refetch)
  const [justCompleted, setJustCompleted] = useState(false);

  const { data: scores = EMPTY_SCORES } = useQuery<TodayScores>({
    queryKey: ["/api/scores/user", userId, "today"],
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });

  const { data: todayMissions = [] } = useQuery<UserMission[]>({
    queryKey: ["/api/missions", userId, "today"],
    enabled: !!userId,
  });

  const checkedIn = scores.hasCheckedIn || justCompleted;

  const missionPointsToday = todayMissions.reduce((sum, m) => sum + m.pointsEarned, 0);
  const solarPoints = (checkedIn ? POINT_VALUES.checkin : 0) + missionPointsToday;

  const handleCheckinComplete = useCallback(() => {
    setJustCompleted(true);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = user?.name?.split(" ")[0] || "Colaborador";
  const domains = getDomainMeta();

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/8 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-2 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <AnimatedBrandLogo size="compact" showWordmark={false} />
          <div>
            <p className="text-xs text-muted-foreground">JuPhD Care</p>
            <p className="text-sm font-semibold">{firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SolarPointsBadge points={solarPoints} />
          <NotificationBadge onClick={() => setDrawerOpen(true)} />
          <button
            onClick={() => navigate("/settings")}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Configurações"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-24">
        {/* Sky visualization — compact when check-in pending, hero when done */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <SkyHeader
            skyState={scores.skyState}
            solarHaloLevel={scores.solarHaloLevel}
            size={checkedIn ? "hero" : "compact"}
          />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {greeting()}, {firstName}!
          </p>
        </motion.section>

        {/* Inline check-in OR post-check-in completion card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          {checkedIn ? (
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3 border-score-good/20">
              <div className="w-10 h-10 rounded-xl bg-score-good/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-score-good" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Check-in completo</p>
                <p className="text-xs text-muted-foreground">
                  Seus scores estão atualizados para hoje.
                </p>
              </div>
            </div>
          ) : (
            <InlineCheckin
              userId={userId}
              onComplete={handleCheckinComplete}
              onNavigateProtection={() => navigate("/protecao")}
            />
          )}
        </motion.section>

        {/* Score cards — only visible after check-in */}
        <AnimatePresence>
          {checkedIn && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.3 }}
              className="mt-5 space-y-3"
            >
              {domains.map((d) => (
                <ScoreCard
                  key={d.id}
                  domainId={d.id}
                  title={d.label}
                  description={d.description}
                  score={scores.domainScores[d.id] ?? 0}
                  contributors={buildContributors(d.id, scores)}
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Insight do dia — only after check-in */}
        {checkedIn && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 glass-card rounded-2xl p-4"
          >
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-accent" />
              Insight do dia
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {getDailyInsight(scores)}
            </p>
          </motion.section>
        )}

        {/* Mission CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <button
            onClick={() => navigate("/missions")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-primary/15 transition-colors text-left"
            data-testid="button-missions"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Missões do dia</p>
              <p className="text-xs text-muted-foreground">
                Complete missões e ganhe Pontos Solares
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        </motion.section>

        {/* Team Challenge CTA — M4 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-3"
        >
          {(() => {
            const tc = getCurrentChallenge();
            return (
              <button
                onClick={() => navigate("/team")}
                className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-brand-gold/20 transition-colors text-left"
                data-testid="button-team-challenge"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-brand-gold-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{tc.template.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {tc.progressPct}% · {tc.daysRemaining} dias restantes
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            );
          })()}
        </motion.section>

        {/* Minha Jornada CTA — M3 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-3"
        >
          <button
            onClick={() => navigate("/meu-cuidado")}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:border-brand-teal/20 transition-colors text-left"
            data-testid="button-meu-cuidado"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-brand-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Minha Jornada</p>
              <p className="text-xs text-muted-foreground">
                Histórico, tendências e descobertas pessoais
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        </motion.section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-20 glass-card border-t border-border/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center gap-1 text-primary"
            data-testid="nav-home"
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </button>
          <button
            onClick={() => navigate("/checkin")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-checkin"
          >
            <Activity className="w-5 h-5" />
            <span className="text-xs">Check-in</span>
          </button>
          <button
            onClick={() => navigate("/missions")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-missions"
          >
            <Target className="w-5 h-5" />
            <span className="text-xs">Missões</span>
          </button>
          <button
            onClick={() => navigate("/support")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-support"
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Apoio</span>
          </button>
          <button
            onClick={() => navigate("/protecao")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-protection"
          >
            <Shield className="w-5 h-5" />
            <span className="text-xs">Proteção</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
