import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, ChevronRight, Sparkles, Activity, Shield, Target, Lightbulb,
  Heart, Trophy, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBrandLogo from "@/components/animated-brand-logo";
import SkyHeader from "@/components/sky-header";
import ScoreCard, { type ScoreContributor } from "@/components/score-card";
import SolarPointsBadge from "@/components/solar-points-badge";
import NotificationBadge from "@/components/notification-badge";
import NotificationDrawer from "@/components/notification-drawer";
import { useAuth } from "@/lib/auth";
import { getTodayScores, getDomainMeta, type TodayScores } from "@/lib/score-engine";
import { DAILY_STEPS, type ScoreDomainId } from "@/lib/checkin-data";
import { getCurrentChallenge } from "@/lib/team-challenge-engine";

// ── Insight do dia (static placeholder) ───────────
// DEBT: replace with dynamic insight engine [M3]
const DAILY_INSIGHTS = [
  "Sua recarga está boa — manter o padrão de sono faz diferença.",
  "Que tal uma pausa de 5 minutos? Pequenos intervalos turbam sua energia.",
  "Pessoas que fazem check-in consistentemente percebem melhorias em 2 semanas.",
  "Respiração pausada por 1 minuto já reduz tensão perceptível.",
  "Lembre-se: dias difíceis fazem parte. O importante é o padrão, não o ponto.",
];

function pickDailyInsight(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return DAILY_INSIGHTS[dayOfYear % DAILY_INSIGHTS.length];
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

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [scores, setScores] = useState<TodayScores>(getTodayScores);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Re-read scores when page gains focus (e.g. coming back from check-in)
  useEffect(() => {
    function refresh() { setScores(getTodayScores()); }
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
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
          <SolarPointsBadge />
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
        {/* Sky visualization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <SkyHeader
            skyState={scores.skyState}
            solarHaloLevel={scores.solarHaloLevel}
            size="hero"
          />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {greeting()}, {firstName}!
          </p>
        </motion.section>

        {/* Check-in CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Button
            onClick={() => navigate("/checkin")}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-2xl border-0 glow-amber relative overflow-hidden group"
            data-testid="button-checkin"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles className="w-5 h-5 mr-3 text-accent" />
            {scores.hasCheckedIn ? "Check-in realizado ✓" : "Fazer check-in diário"}
            <ChevronRight className="w-5 h-5 ml-3" />
          </Button>
        </motion.section>

        {/* Score cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Insight do dia */}
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
            {pickDailyInsight()}
          </p>
        </motion.section>

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
