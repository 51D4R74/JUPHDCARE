import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import {
  Shield, AlertTriangle, TrendingUp, Users, Activity, Brain,
  LogOut, BarChart3, Flame, ChevronRight, Bell, ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { CheckIn } from "@shared/schema";

const heatmapData = [
  { department: "Vendas", stress: 72, burnout: 65, satisfaction: 45, risk: "Alto" },
  { department: "TI", stress: 58, burnout: 52, satisfaction: 62, risk: "Médio" },
  { department: "Marketing", stress: 45, burnout: 38, satisfaction: 75, risk: "Baixo" },
  { department: "Financeiro", stress: 62, burnout: 58, satisfaction: 55, risk: "Médio" },
  { department: "Operações", stress: 68, burnout: 60, satisfaction: 50, risk: "Alto" },
];

const burnoutPrediction = [
  { month: "Jan", atual: 35, previsao: null },
  { month: "Fev", atual: 38, previsao: null },
  { month: "Mar", atual: 42, previsao: null },
  { month: "Abr", atual: 45, previsao: null },
  { month: "Mai", atual: 48, previsao: null },
  { month: "Jun", atual: 52, previsao: null },
  { month: "Jul", atual: null, previsao: 56 },
  { month: "Ago", atual: null, previsao: 61 },
  { month: "Set", atual: null, previsao: 58 },
];

const alerts = [
  {
    severity: "high",
    title: "Padrões de linguagem tóxica detectados",
    desc: "Equipe de Vendas — Risco Alto. Análise imparcial de comunicação identificou padrões recorrentes.",
    time: "2h atrás",
  },
  {
    severity: "medium",
    title: "Pico de estresse detectado",
    desc: "Departamento de TI — 3 colaboradores reportaram exaustão nos últimos 5 dias.",
    time: "6h atrás",
  },
  {
    severity: "low",
    title: "Tendência positiva em Marketing",
    desc: "Indicadores de bem-estar melhoraram 18% nas últimas 2 semanas.",
    time: "1d atrás",
  },
];

const moodDistribution = [
  { name: "Bem", value: 32, color: "#34d399" },
  { name: "Ansioso", value: 22, color: "#f87171" },
  { name: "Calmo", value: 18, color: "#22d3ee" },
  { name: "Tenso", value: 15, color: "#fb923c" },
  { name: "Outros", value: 13, color: "#94a3b8" },
];

function getRiskColor(risk: string) {
  if (risk === "Alto") return "text-red-400 bg-red-500/10 border-red-500/20";
  if (risk === "Médio") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
}

function getSeverityColor(s: string) {
  if (s === "high") return "border-l-red-400";
  if (s === "medium") return "border-l-amber-400";
  return "border-l-emerald-400";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

export default function RHDashboardPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  const { data: checkIns } = useQuery<CheckIn[]>({
    queryKey: ["/api/checkins"],
  });

  const totalCheckins = checkIns?.length || 0;
  const stressedCount = checkIns?.filter((c) =>
    ["Ansioso", "Tenso", "Irritado", "Triste"].includes(c.humor)
  ).length || 0;
  const wellBeingRate = totalCheckins > 0
    ? Math.round(((totalCheckins - stressedCount) / totalCheckins) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">JuPhD Care — Painel RH</h1>
              <p className="text-xs text-muted-foreground">Organizational Risk Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors" data-testid="button-notifications">
              <Bell className="w-4.5 h-4.5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
            </button>
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-muted-foreground"
              data-testid="button-rh-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5" data-testid="stat-checkins">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-2xl font-bold">{totalCheckins}</p>
            <p className="text-xs text-muted-foreground mt-1">Check-ins Totais</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5" data-testid="stat-wellbeing">
            <div className="flex items-center justify-between mb-3">
              <Brain className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +5%
              </span>
            </div>
            <p className="text-2xl font-bold">{wellBeingRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Índice de Bem-estar</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5" data-testid="stat-stress">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-red-400 flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" /> -3%
              </span>
            </div>
            <p className="text-2xl font-bold">{stressedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Relatos de Estresse</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5" data-testid="stat-departments">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground mt-1">Departamentos Monitorados</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Pressão Psicossocial por Departamento
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Mapa de calor — indicadores de estresse e burnout</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={heatmapData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="stress" name="Estresse" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="burnout" name="Burnout" fill="#fb923c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="satisfaction" name="Satisfação" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Distribuição de Humor
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Últimos 30 dias</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {moodDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {moodDistribution.map((m) => (
                <div key={m.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-muted-foreground">{m.name} ({m.value}%)</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Predição de Tendência de Burnout
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Risco projetado baseado em carga de trabalho e check-ins</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={burnoutPrediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="atual"
                  name="Atual"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 3 }}
                />
                <Area
                  type="monotone"
                  dataKey="previsao"
                  name="Previsão"
                  stroke="#f87171"
                  fill="#f87171"
                  fillOpacity={0.05}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={{ fill: "#f87171", r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              Nível de Risco por Área
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Classificação atual</p>
            <div className="space-y-3">
              {heatmapData.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50" data-testid={`risk-dept-${dept.department}`}>
                  <div>
                    <p className="text-sm font-medium">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">Estresse: {dept.stress}%</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${getRiskColor(dept.risk)}`}>
                    {dept.risk}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detecção Imparcial de Assédio — Alertas Ativos
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Análise automatizada de padrões comportamentais</p>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg bg-slate-800/30 border-l-2 ${getSeverityColor(alert.severity)}`}
                data-testid={`alert-${i}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
