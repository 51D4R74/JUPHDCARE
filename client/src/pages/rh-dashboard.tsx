/**
 * RH Dashboard — Organizational Risk Dashboard.
 *
 * Rewritten for M4 with aggregate data structure matching the API contract:
 *   GET /api/rh/aggregate → { departments, alerts, participation }
 *
 * Current implementation uses structured stubs. The data shape is stable;
 * only the source changes when backend is connected.
 *
 * DEBT: connect to real API endpoint when backend aggregate service is ready [M5]
 */

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie,
} from "recharts";
import {
  Shield, AlertTriangle, TrendingUp, Users, Activity, Brain,
  LogOut, BarChart3, Flame, Bell, ArrowUpRight, ArrowDownRight,
  Trophy, Heart, Percent,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import RHAggregateCard from "@/components/rh-aggregate-card";
import { getCurrentChallenge } from "@/lib/team-challenge-engine";

// ── Aggregate data types (match API contract) ─────

interface DomainAverage {
  domain: string;
  label: string;
  avg: number;
}

interface DeptAggregate {
  department: string;
  headcount: number;
  participationRate: number; // 0–100
  domainAverages: DomainAverage[];
  riskLevel: "low" | "medium" | "high";
  stressIndex: number;     // 0–100
  burnoutIndex: number;    // 0–100
}

interface AggregateAlert {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  department: string;
  timestamp: string; // relative time
}

interface RHAggregateData {
  departments: DeptAggregate[];
  alerts: AggregateAlert[];
  participation: number; // overall 0–100
  totalCollaborators: number;
  activeCollaborators: number;
  averageWellbeing: number; // 0–100
  trendBurnout: { month: string; value: number | null; forecast: number | null }[];
  moodDistribution: { name: string; value: number; color: string }[];
}

// ── Structured stub data ──────────────────────────

function getAggregateData(): RHAggregateData {
  return {
    totalCollaborators: 87,
    activeCollaborators: 72,
    participation: 83,
    averageWellbeing: 64,
    departments: [
      {
        department: "Vendas",
        headcount: 22,
        participationRate: 78,
        riskLevel: "high",
        stressIndex: 72,
        burnoutIndex: 65,
        domainAverages: [
          { domain: "recarga", label: "Recarga", avg: 42 },
          { domain: "estado-do-dia", label: "Estado do dia", avg: 48 },
          { domain: "seguranca-relacional", label: "Segurança relacional", avg: 38 },
        ],
      },
      {
        department: "TI",
        headcount: 18,
        participationRate: 88,
        riskLevel: "medium",
        stressIndex: 58,
        burnoutIndex: 52,
        domainAverages: [
          { domain: "recarga", label: "Recarga", avg: 61 },
          { domain: "estado-do-dia", label: "Estado do dia", avg: 55 },
          { domain: "seguranca-relacional", label: "Segurança relacional", avg: 58 },
        ],
      },
      {
        department: "Marketing",
        headcount: 15,
        participationRate: 92,
        riskLevel: "low",
        stressIndex: 45,
        burnoutIndex: 38,
        domainAverages: [
          { domain: "recarga", label: "Recarga", avg: 74 },
          { domain: "estado-do-dia", label: "Estado do dia", avg: 72 },
          { domain: "seguranca-relacional", label: "Segurança relacional", avg: 78 },
        ],
      },
      {
        department: "Financeiro",
        headcount: 12,
        participationRate: 75,
        riskLevel: "medium",
        stressIndex: 62,
        burnoutIndex: 58,
        domainAverages: [
          { domain: "recarga", label: "Recarga", avg: 52 },
          { domain: "estado-do-dia", label: "Estado do dia", avg: 56 },
          { domain: "seguranca-relacional", label: "Segurança relacional", avg: 50 },
        ],
      },
      {
        department: "Operações",
        headcount: 20,
        participationRate: 80,
        riskLevel: "high",
        stressIndex: 68,
        burnoutIndex: 60,
        domainAverages: [
          { domain: "recarga", label: "Recarga", avg: 45 },
          { domain: "estado-do-dia", label: "Estado do dia", avg: 50 },
          { domain: "seguranca-relacional", label: "Segurança relacional", avg: 42 },
        ],
      },
    ],
    alerts: [
      {
        id: "a1",
        severity: "high",
        title: "Padrões de risco relacional elevados",
        description: "Equipe de Vendas — 6 colaboradores com segurança relacional abaixo de 30 nos últimos 14 dias.",
        department: "Vendas",
        timestamp: "2h atrás",
      },
      {
        id: "a2",
        severity: "medium",
        title: "Pico de estresse detectado",
        description: "Departamento de TI — aumento de 15% no índice de estresse nos últimos 7 dias.",
        department: "TI",
        timestamp: "6h atrás",
      },
      {
        id: "a3",
        severity: "low",
        title: "Tendência positiva em Marketing",
        description: "Indicadores de bem-estar melhoraram 18% nas últimas 2 semanas. Recarga média: 74.",
        department: "Marketing",
        timestamp: "1d atrás",
      },
    ],
    trendBurnout: [
      { month: "Jan", value: 35, forecast: null },
      { month: "Fev", value: 38, forecast: null },
      { month: "Mar", value: 42, forecast: null },
      { month: "Abr", value: 45, forecast: null },
      { month: "Mai", value: 48, forecast: null },
      { month: "Jun", value: 52, forecast: null },
      { month: "Jul", value: null, forecast: 56 },
      { month: "Ago", value: null, forecast: 61 },
      { month: "Set", value: null, forecast: 58 },
    ],
    moodDistribution: [
      { name: "Bem", value: 32, color: "#34d399" },
      { name: "Ansioso", value: 22, color: "#f87171" },
      { name: "Calmo", value: 18, color: "#22d3ee" },
      { name: "Tenso", value: 15, color: "#fb923c" },
      { name: "Outros", value: 13, color: "#94a3b8" },
    ],
  };
}

// ── Helpers ────────────────────────────────────────

function getRiskColor(level: string) {
  if (level === "high") return "text-score-critical bg-score-critical/10 border-score-critical/20";
  if (level === "medium") return "text-score-moderate bg-score-moderate/10 border-score-moderate/20";
  return "text-score-good bg-score-good/10 border-score-good/20";
}

function getRiskLabel(level: string) {
  if (level === "high") return "Alto";
  if (level === "medium") return "Médio";
  return "Baixo";
}

function getSeverityBorder(s: string) {
  if (s === "high") return "border-l-score-critical";
  if (s === "medium") return "border-l-score-moderate";
  return "border-l-score-good";
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border-soft rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────

export default function RHDashboardPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  const data = getAggregateData();
  const teamChallenge = getCurrentChallenge();

  // Chart data for department stress/burnout comparison
  const deptChartData = data.departments.map((d) => ({
    department: d.department,
    stress: d.stressIndex,
    burnout: d.burnoutIndex,
    satisfaction: 100 - d.stressIndex, // derived inverse for visualization
  }));

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <header className="border-b border-border-soft bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">JuPhD Care — Painel RH</h1>
              <p className="text-xs text-muted-foreground">Visão Organizacional Agregada</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg hover:bg-black/5 transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {data.alerts.filter((a) => a.severity === "high").length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-score-critical rounded-full" />
              )}
            </button>
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors text-muted-foreground"
              data-testid="button-rh-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <RHAggregateCard
            icon={<Users className="w-5 h-5 text-brand-teal" />}
            label="Colaboradores Ativos"
            value={`${data.activeCollaborators}/${data.totalCollaborators}`}
            subtitle={`${data.participation}% de participação`}
            trend={{ direction: "up", value: "+8%" }}
            trendPositive="up"
            delay={0}
          />
          <RHAggregateCard
            icon={<Brain className="w-5 h-5 text-score-good" />}
            label="Índice de Bem-estar"
            value={`${data.averageWellbeing}%`}
            subtitle="Média geral (3 domínios)"
            trend={{ direction: "up", value: "+5%" }}
            trendPositive="up"
            delay={0.05}
          />
          <RHAggregateCard
            icon={<Flame className="w-5 h-5 text-score-attention" />}
            label="Departamentos em Risco"
            value={data.departments.filter((d) => d.riskLevel === "high").length}
            subtitle={`de ${data.departments.length} monitorados`}
            trend={{ direction: "down", value: "-1" }}
            trendPositive="down"
            delay={0.1}
          />
          <RHAggregateCard
            icon={<Activity className="w-5 h-5 text-brand-navy" />}
            label="Alertas Ativos"
            value={data.alerts.length}
            subtitle={`${data.alerts.filter((a) => a.severity === "high").length} alta severidade`}
            delay={0.15}
          />
        </div>

        {/* Team challenge summary for RH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border-soft bg-white p-5 mb-8 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-brand-gold-dark" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Desafio Coletivo: {teamChallenge.template.title}</h3>
            <p className="text-xs text-muted-foreground">
              {teamChallenge.progressPct}% concluído · {teamChallenge.daysRemaining} dias restantes · {teamChallenge.progress}/{teamChallenge.template.target} {teamChallenge.template.unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-brand-gold-dark">{teamChallenge.progressPct}%</p>
          </div>
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Department stress/burnout chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 rounded-xl border border-border-soft bg-white p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-score-attention" />
              Pressão Psicossocial por Departamento
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Índice de estresse e burnout — dados agregados
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptChartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DE" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11, fill: "#5E6D7C" }}
                  axisLine={{ stroke: "#DDD8D2" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#5E6D7C" }}
                  axisLine={{ stroke: "#DDD8D2" }}
                  domain={[0, 100]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="stress" name="Estresse" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="burnout" name="Burnout" fill="#fb923c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Mood distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border-soft bg-white p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-teal" />
              Distribuição de Humor
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Últimos 30 dias — agregado</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.moodDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid hsl(var(--border-soft))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {data.moodDistribution.map((m) => (
                <div key={m.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-muted-foreground">{m.name} ({m.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Second row: burnout trend + participation by department */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Burnout trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 rounded-xl border border-border-soft bg-white p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-score-moderate" />
              Tendência de Risco de Burnout
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Risco projetado — baseado em dados agregados de carga e check-ins
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.trendBurnout}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DE" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#5E6D7C" }}
                  axisLine={{ stroke: "#DDD8D2" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#5E6D7C" }}
                  axisLine={{ stroke: "#DDD8D2" }}
                  domain={[0, 100]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Atual"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 3 }}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  name="Previsão"
                  stroke="#f87171"
                  fill="#f87171"
                  fillOpacity={0.05}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={{ fill: "#f87171", r: 3 }}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Participation by department */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border-soft bg-white p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Percent className="w-4 h-4 text-brand-navy" />
              Participação por Área
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Taxa de check-in — últimos 30 dias
            </p>
            <div className="space-y-3">
              {data.departments.map((dept) => (
                <div key={dept.department} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{dept.department}</span>
                    <span className="text-xs text-muted-foreground">{dept.participationRate}%</span>
                  </div>
                  <div className="h-2 bg-surface-warm rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.participationRate}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={`h-full rounded-full ${
                        dept.participationRate >= 85
                          ? "bg-score-good"
                          : dept.participationRate >= 70
                            ? "bg-score-moderate"
                            : "bg-score-attention"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Risk level by department + domain averages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk classification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border-soft bg-white p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-score-critical" />
              Nível de Risco por Área
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Classificação baseada em indicadores agregados</p>
            <div className="space-y-3">
              {data.departments.map((dept) => (
                <div
                  key={dept.department}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-warm/80"
                  data-testid={`risk-dept-${dept.department}`}
                >
                  <div>
                    <p className="text-sm font-medium">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept.headcount} pessoas · Estresse: {dept.stressIndex}%
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${getRiskColor(dept.riskLevel)}`}>
                    {getRiskLabel(dept.riskLevel)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Domain averages by department */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border-soft bg-white p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-teal" />
              Médias por Domínio
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Recarga · Estado do dia · Segurança relacional</p>
            <div className="space-y-4">
              {data.departments.map((dept) => (
                <div key={dept.department}>
                  <p className="text-xs font-medium mb-2">{dept.department}</p>
                  <div className="flex gap-2">
                    {dept.domainAverages.map((da) => {
                      const tier =
                        da.avg >= 75
                          ? "bg-score-good/15 text-score-good border-score-good/20"
                          : da.avg >= 50
                            ? "bg-score-moderate/15 text-score-moderate border-score-moderate/20"
                            : da.avg >= 25
                              ? "bg-score-attention/15 text-score-attention border-score-attention/20"
                              : "bg-score-critical/15 text-score-critical border-score-critical/20";
                      return (
                        <div
                          key={da.domain}
                          className={`flex-1 rounded-lg border px-2 py-1.5 text-center ${tier}`}
                        >
                          <p className="text-[10px] font-medium truncate">{da.label}</p>
                          <p className="text-sm font-bold">{da.avg}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-xl border border-border-soft bg-white p-6"
        >
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-score-moderate" />
            Alertas Organizacionais
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Detecção automatizada de padrões — dados sempre agregados, nunca individuais
          </p>
          <div className="space-y-3">
            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg bg-surface-warm/60 border-l-2 ${getSeverityBorder(alert.severity)}`}
                data-testid={`alert-${alert.severity}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy footer */}
        <div className="mt-6 text-center pb-8">
          <p className="text-[10px] text-muted-foreground/50 max-w-md mx-auto leading-relaxed">
            Este painel exibe apenas dados agregados. Nenhum colaborador individual
            é identificado. Taxas de participação são percentuais por departamento,
            sem nomes ou IDs.
          </p>
        </div>
      </main>
    </div>
  );
}
