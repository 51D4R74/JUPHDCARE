import { useState, useMemo, useReducer } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Sun, Activity, Target, BookOpen,
  Heart, Star, TrendingUp, FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import ConstancyDots from "@/components/constancy-dots";
import InsightCard from "@/components/insight-card";
import SupportMessageCard from "@/components/support-message-card";
import ScoreCard, { type ScoreContributor } from "@/components/score-card";
import { computeTagCloud, DOMAIN_COLORS, getDomainMeta, type TagCount, type TodayScores } from "@/lib/score-engine";
import { DAILY_STEPS, type ScoreDomainId } from "@/lib/checkin-data";
import { computeDiscoveries, daysUntilDiscovery, DISCOVERY_MIN_RECORDS } from "@/lib/discovery-engine";
import { getFavoriteMessages, toggleFavorite, isFavorite } from "@/lib/support-engine";
import { useAuth } from "@/lib/auth";
import type { CheckInHistoryRecord } from "@shared/schema";

// ── Chart config ────────────────────────────────────────────

const DOMAIN_LABELS: Record<ScoreDomainId, string> = {
  recarga: "Recarga",
  "estado-do-dia": "Estado do dia",
  "seguranca-relacional": "Seg. relacional",
};

// ── Custom tooltip ────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: Readonly<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 border border-border/30 text-xs shadow-md">
      <p className="text-muted-foreground mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5 mb-0.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-foreground">
            {DOMAIN_LABELS[p.name as ScoreDomainId] ?? p.name}: <strong>{p.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Tag pill ──────────────────────────────────────

function TagPill({ tag }: Readonly<{ tag: TagCount }>) {
  const size = Math.min(tag.count, 5); // cap visual intensity at 5
  const opacity = 0.4 + size * 0.12;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-border/40"
      style={{ backgroundColor: `rgba(var(--brand-navy-rgb, 26 54 93) / ${opacity})` }}
    >
      {tag.label}
      <span className="text-muted-foreground">×{tag.count}</span>
    </motion.span>
  );
}

function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? singular : pluralForm;
}

const EMPTY_SCORES: TodayScores = {
  domainScores: { recarga: 0, "estado-do-dia": 0, "seguranca-relacional": 0 },
  skyState: "partly-cloudy",
  solarHaloLevel: 0.5,
  flags: [],
  hasCheckedIn: false,
};

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
      value: 1,
      maxValue: 1,
    } satisfies ScoreContributor;
  }).filter(Boolean) as ScoreContributor[];
}

// ── Page ──────────────────────────────────────────

export default function MeuCuidadoPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [range, setRange] = useState<7 | 30>(7);

  // Server-canonical check-in history — primary data source
  const { data: allHistory = [] } = useQuery<CheckInHistoryRecord[]>({
    queryKey: ["/api/checkins/user", user?.id ?? "", "history"],
    enabled: !!user?.id,
  });

  // Today's scores for domain cards
  const { data: scores = EMPTY_SCORES } = useQuery<TodayScores>({
    queryKey: ["/api/scores/user", user?.id ?? "", "today"],
    enabled: !!user?.id,
  });

  const domains = getDomainMeta();

  // Client-side range filter (no re-fetch needed)
  const records = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - range);
    const cutoffDate = cutoff.toISOString().slice(0, 10);
    return allHistory.filter((r) => r.date >= cutoffDate);
  }, [allHistory, range]);

  const tagCloud = useMemo(
    () => computeTagCloud(allHistory.slice(-30)),
    [allHistory],
  );
  const [, forceFavUpdate] = useReducer((x: number) => x + 1, 0);
  const favorites = getFavoriteMessages();

  const discoveries = useMemo(
    () => computeDiscoveries(allHistory),
    [allHistory],
  );
  const daysLeft = daysUntilDiscovery(allHistory.length);
  const hasEnoughData = allHistory.length >= DISCOVERY_MIN_RECORDS;

  // Chart data: oldest → newest
  const chartData = useMemo(
    () =>
      [...records]
        .reverse()
        .map((r) => ({
          date: r.date.slice(5).replace("-", "/"),
          recarga: r.domainScores.recarga,
          "estado-do-dia": r.domainScores["estado-do-dia"],
          "seguranca-relacional": r.domainScores["seguranca-relacional"],
        })),
    [records],
  );

  const hasChartData = chartData.length > 0;

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-teal/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao início
        </button>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-28">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Meu Cuidado</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sua jornada ao longo do tempo.
          </p>
        </motion.div>

        {/* ── Constancy ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-4 mb-4"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Constância — últimos 10 dias
          </p>
          <ConstancyDots days={10} checkedInDates={allHistory.map((r) => r.date)} />
          <p className="text-xs text-muted-foreground mt-2">
            {allHistory.length === 0
              ? "Faça seu primeiro check-in para começar."
              : `${allHistory.length} check-in${plural(allHistory.length, "", "s")} no total.`}
          </p>
        </motion.section>

        {/* ── Score cards — today's domain scores ── */}
        {scores.hasCheckedIn && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-4 space-y-3"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Scores de hoje
            </p>
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

        {/* ── Score trend chart ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tendência de scores
            </p>
            <div className="flex rounded-xl border border-border/40 overflow-hidden text-xs">
              {([7, 30] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 transition-colors font-medium ${
                    range === r
                      ? "bg-brand-navy text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>

          {/* Chart legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            {(Object.keys(DOMAIN_COLORS) as ScoreDomainId[]).map((d) => (
              <div key={d} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: DOMAIN_COLORS[d] }}
                />
                <span className="text-[11px] text-muted-foreground">
                  {DOMAIN_LABELS[d]}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {hasChartData ? (
              <motion.div
                key={`chart-${range}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ height: 160 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    {(Object.keys(DOMAIN_COLORS) as ScoreDomainId[]).map((d) => (
                      <Line
                        key={d}
                        type="monotone"
                        dataKey={d}
                        stroke={DOMAIN_COLORS[d]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div
                key="chart-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-[100px] text-muted-foreground text-sm"
              >
                Sem dados para este período.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── Discoveries ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-teal" />
            <h2 className="text-sm font-semibold">Descobertas pessoais</h2>
          </div>

          {hasEnoughData && discoveries.length > 0 ? (
            <div className="space-y-3">
              {discoveries.map((d) => (
                <InsightCard key={d.id} discovery={d} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-4 border border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {daysLeft > 0
                      ? `${daysLeft} dia${plural(daysLeft, "", "s")} para sua primeira descoberta`
                      : "Continue fazendo check-ins para descobertas."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Precisamos de {DISCOVERY_MIN_RECORDS} dias com tags para detectar padrões.
                  </p>
                </div>
              </div>
              {daysLeft > 0 && (
                <div className="mt-3 h-1.5 bg-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-teal rounded-full transition-all"
                    style={{
                      width: `${((DISCOVERY_MIN_RECORDS - daysLeft) / DISCOVERY_MIN_RECORDS) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* ── Tag cloud ── */}
        {tagCloud.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Contextos mais frequentes — últimos 30 dias
            </p>
            <div className="flex flex-wrap gap-2">
              {tagCloud.map((tag) => (
                <TagPill key={tag.flag} tag={tag} />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Weekly report CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/report")}
          className="w-full glass-card rounded-2xl p-4 border border-brand-navy/15 flex items-center gap-3 text-left hover:border-brand-navy/30 transition-colors mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-brand-navy" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Ver Relatório Pessoal</p>
            <p className="text-xs text-muted-foreground">Resumo semanal e mensal do seu cuidado</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
        </motion.button>

        {/* ── Favorite messages ── */}
        {favorites.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-brand-gold" />
              <h2 className="text-sm font-semibold">Mensagens favoritas</h2>
            </div>
            <div className="space-y-3">
              {favorites.slice(0, 3).map((msg) => (
                <SupportMessageCard
                  key={msg.id}
                  message={msg}
                  isFavorite={isFavorite(msg.id)}
                  onToggleFavorite={(id) => { toggleFavorite(id); forceFavUpdate(); }}
                />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 inset-x-0 z-20 glass-card border-t border-border/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-home-mc"
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Início</span>
          </button>
          <button
            onClick={() => navigate("/checkin")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-checkin-mc"
          >
            <Activity className="w-5 h-5" />
            <span className="text-xs">Check-in</span>
          </button>
          <button
            onClick={() => navigate("/missions")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-missions-mc"
          >
            <Target className="w-5 h-5" />
            <span className="text-xs">+Você</span>
          </button>
          <button
            onClick={() => navigate("/support")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="nav-support-mc"
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Apoio</span>
          </button>
          <button
            onClick={() => navigate("/meu-cuidado")}
            className="flex flex-col items-center gap-1 text-brand-teal"
            data-testid="nav-jornada-mc"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-medium">Jornada</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
