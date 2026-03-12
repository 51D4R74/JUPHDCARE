import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Sun, Activity, Shield, Target, ChevronLeft, Heart,
} from "lucide-react";
import MissionCard, { type MissionDef, type MissionStatus } from "@/components/mission-card";
import SolarPointsBadge from "@/components/solar-points-badge";
import ConstancyDots from "@/components/constancy-dots";
import Microcheck from "@/components/microcheck";
import { getTodayScores, saveMicroMood } from "@/lib/score-engine";
import { selectMissions, POINT_VALUES } from "@/lib/mission-engine";
import { recordNeedSupport } from "@/lib/support-engine";
import type { MicroMoodId } from "@/components/one-tap-mood";
import {
  readMissionState, writeMissionState,
  getTotalPointsToday, type MissionDayState,
} from "@/lib/points-ledger";

// ── Page ──────────────────────────────────────────

export default function MissionCenterPage() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<MissionDayState>(readMissionState);
  const scores = getTodayScores();
  const [microcheckOpen, setMicrocheckOpen] = useState(false);
  const [microcheckCount, setMicrocheckCount] = useState(0);

  // Persist on change
  useEffect(() => {
    writeMissionState(state);
  }, [state]);

  // Adaptive mission selection via engine
  const missions: MissionDef[] = useMemo(() => {
    return selectMissions({
      skyState: scores.skyState,
      domainScores: scores.domainScores,
      flags: scores.flags,
      recentMissionIds: state.completed,
    });
  }, [scores.skyState, scores.domainScores, scores.flags, state.completed]);

  const totalMissions = missions.length;
  const completedCount = state.completed.filter(
    (id) => missions.some((m) => m.id === id),
  ).length;
  const progress = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;

  const totalPoints = getTotalPointsToday();

  const handleComplete = useCallback((missionId: string) => {
    setState((prev) => {
      if (prev.completed.includes(missionId)) return prev;
      const mission = missions.find((m) => m.id === missionId);
      const pts = mission?.points ?? 5;
      return {
        ...prev,
        completed: [...prev.completed, missionId],
        solarPoints: prev.solarPoints + pts,
      };
    });
    // Trigger microcheck after mission (max 2/day)
    if (microcheckCount < POINT_VALUES.microchecksMaxPerDay) {
      setTimeout(() => setMicrocheckOpen(true), 600);
    }
  }, [missions, microcheckCount]);

  const handleMicrocheckRespond = useCallback(
    (mood: MicroMoodId, context?: string) => {
      saveMicroMood(mood);
      setMicrocheckCount((c) => c + 1);
      if (mood === "need-support") {
        recordNeedSupport();
        navigate("/support");
      }
    },
    [navigate],
  );

  function getStatus(missionId: string): MissionStatus {
    return state.completed.includes(missionId) ? "done" : "pending";
  }

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/8 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-2 flex items-center gap-3 max-w-lg mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 -ml-2 rounded-xl hover:bg-black/5 transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Missões do dia</h1>
          <p className="text-xs text-muted-foreground">
            Complete para ganhar Pontos Solares
          </p>
        </div>
        {/* Solar Points badge */}
        <SolarPointsBadge points={totalPoints} />
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-24">
        {/* Progress bar */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 glass-card rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {completedCount}/{totalMissions} missões
            </span>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-brand-gold"
            />
          </div>
          {completedCount === totalMissions && totalMissions > 0 && (
            <p className="text-xs text-emerald-600 font-medium mt-2 text-center">
              🎉 Todas as missões concluídas! Parabéns!
            </p>
          )}
        </motion.section>

        {/* Mission list */}
        <section className="mt-4 space-y-3">
          {missions.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <MissionCard
                mission={m}
                status={getStatus(m.id)}
                onComplete={handleComplete}
              />
            </motion.div>
          ))}
        </section>

        {/* Check-in points reminder */}
        {!scores.hasCheckedIn && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 glass-card rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-brand-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Faça seu check-in</p>
              <p className="text-xs text-muted-foreground">
                Ganhe +{POINT_VALUES.checkin} ☀️ ao completar seu check-in diário
              </p>
            </div>
            <button
              onClick={() => navigate("/checkin")}
              className="text-xs font-semibold text-brand-navy px-3 py-1.5 rounded-lg bg-brand-navy/10 hover:bg-brand-navy/20 transition-colors"
            >
              Ir
            </button>
          </motion.section>
        )}

        {/* Constancy dots — last 10 days */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 glass-card rounded-2xl p-4"
        >
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Constância — últimos 10 dias
          </p>
          <ConstancyDots days={10} />
        </motion.section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-20 glass-card border-t border-border/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-home"
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Início</span>
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
            className="flex flex-col items-center gap-1 text-brand-navy"
            data-testid="nav-missions"
          >
            <Target className="w-5 h-5" />
            <span className="text-xs font-medium">Missões</span>
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

      {/* Microcheck sheet */}
      <Microcheck
        open={microcheckOpen}
        onOpenChange={setMicrocheckOpen}
        onRespond={handleMicrocheckRespond}
        variant="post-mission"
      />
    </div>
  );
}
