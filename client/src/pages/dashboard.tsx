import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Sun, CloudSun, Heart, Brain, Droplets, Wind, Play, Clock,
  Shield, ChevronRight, Sparkles, Activity, Moon, Coffee
} from "lucide-react";
import {
  TbMoodSmile, TbMoodWrrr, TbMoodAngry, TbMoodSad,
  TbMoodHappy, TbMoodEmpty, TbMoodNervous, TbMoodConfuzed,
} from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { CheckIn } from "@shared/schema";

const pills = [
  {
    icon: Brain,
    title: "Técnica de Respiração 4-7-8",
    desc: "Exercício de relaxamento em 2 minutos",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    tag: "Respiração",
  },
  {
    icon: Droplets,
    title: "Lembrete de Hidratação",
    desc: "Beba 250ml de água agora",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
    tag: "Saúde",
  },
  {
    icon: Heart,
    title: "Reestruturação Cognitiva",
    desc: "Identifique padrões de pensamento",
    color: "from-rose-500/20 to-rose-600/10",
    iconColor: "text-rose-400",
    tag: "CBT",
  },
  {
    icon: Wind,
    title: "Mindfulness Guiado",
    desc: "5 minutos de atenção plena",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
    tag: "Meditação",
  },
];

function getMoodIcon(humor: string): React.ComponentType<{ className?: string }> {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    "Bem": TbMoodSmile,
    "Ansioso": TbMoodNervous,
    "Tenso": TbMoodWrrr,
    "Calmo": TbMoodHappy,
    "Motivado": TbMoodSmile,
    "Triste": TbMoodSad,
    "Irritado": TbMoodAngry,
    "Confiante": TbMoodSmile,
    "Inseguro": TbMoodConfuzed,
    "Desanimado": TbMoodEmpty,
  };
  return map[humor] ?? TbMoodSmile;
}

function getEnergyIcon(energy: string) {
  const map: Record<string, typeof Sun> = {
    "Exausto": Moon, "Cansado": Coffee, "Disposto": Activity, "Empolgado": Sparkles,
  };
  return map[energy] || Activity;
}

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  const { data: checkIns } = useQuery<CheckIn[]>({
    queryKey: ["/api/checkins/user", user?.id || ""],
    enabled: !!user?.id,
  });

  const lastCheckIn = checkIns?.[0];
  const todayDone = lastCheckIn?.createdAt
    ? new Date(lastCheckIn.createdAt).toDateString() === new Date().toDateString()
    : false;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = user?.name?.split(" ")[0] || "Colaborador";

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
      </div>

      <header className="relative z-10 px-4 pt-6 pb-2 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center glow-amber">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">JuPhD Care</p>
            <p className="text-sm font-semibold">{firstName}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          data-testid="button-logout"
        >
          Sair
        </button>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-24">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 glass-card rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 flex items-center justify-center flex-shrink-0"
            >
              <CloudSun className="w-7 h-7 text-amber-400" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {greeting()}, {firstName}!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Olá! Minha missão é cuidar muito bem de você. Como posso te ajudar hoje?
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Button
            onClick={() => navigate("/checkin")}
            className="w-full h-16 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-base rounded-2xl border-0 glow-amber relative overflow-hidden group"
            data-testid="button-checkin"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles className="w-5 h-5 mr-3" />
            {todayDone ? "Check-in de hoje completo ✓" : "Fazer Check-in de hoje"}
            <ChevronRight className="w-5 h-5 ml-3" />
          </Button>
        </motion.section>

        {lastCheckIn && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 glass-card rounded-2xl p-5"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Último check-in
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background/40 p-3 text-center">
                {(() => { const Icon = getMoodIcon(lastCheckIn.humor); return <Icon className="w-6 h-6 mx-auto text-amber-400" />; })()}
                <p className="text-xs text-muted-foreground mt-1">Humor</p>
                <p className="text-sm font-medium">{lastCheckIn.humor}</p>
              </div>
              <div className="rounded-xl bg-background/40 p-3 text-center">
                {(() => { const Icon = getEnergyIcon(lastCheckIn.energy); return <Icon className="w-6 h-6 mx-auto text-amber-400" />; })()}
                <p className="text-xs text-muted-foreground mt-1">Energia</p>
                <p className="text-sm font-medium">{lastCheckIn.energy}</p>
              </div>
              <div className="rounded-xl bg-background/40 p-3 text-center">
                <Brain className="w-6 h-6 mx-auto text-blue-400" />
                <p className="text-xs text-muted-foreground mt-1">Mente</p>
                <p className="text-sm font-medium">{lastCheckIn.mind}</p>
              </div>
              <div className="rounded-xl bg-background/40 p-3 text-center">
                <Moon className="w-6 h-6 mx-auto text-indigo-400" />
                <p className="text-xs text-muted-foreground mt-1">Sono</p>
                <p className="text-sm font-medium">{lastCheckIn.sleep}</p>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Pílulas de Conhecimento
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {pills.map((pill, i) => (
              <motion.div
                key={pill.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card rounded-xl p-4 cursor-pointer hover:border-amber-500/20 transition-colors group"
                data-testid={`card-pill-${i}`}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pill.color} flex items-center justify-center mb-3`}>
                  <pill.icon className={`w-4 h-4 ${pill.iconColor}`} />
                </div>
                <p className="text-sm font-medium leading-tight">{pill.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{pill.desc}</p>
                <div className="flex items-center gap-1 mt-3">
                  <Play className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-amber-400/80">{pill.tag}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 glass-card border-t border-border/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center gap-1 text-amber-400"
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
