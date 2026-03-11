import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Sun, Frown, Meh, Smile, Zap,
  Battery, BatteryLow, BatteryFull, BatteryCharging,
  Brain, Focus, Lightbulb, TrendingDown, TrendingUp, CloudLightning,
  Moon, CloudMoon, BedDouble, Sparkles, Star, Sunrise,
  Briefcase, Users, HeartPulse, Heart, MoreHorizontal,
  Save, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

interface StepOption {
  label: string;
  icon: typeof Sun;
  color: string;
  bgColor: string;
}

const humorOptions: StepOption[] = [
  { label: "Ansioso", icon: Frown, color: "text-red-400", bgColor: "from-red-500/20 to-red-600/5" },
  { label: "Tenso", icon: CloudLightning, color: "text-orange-400", bgColor: "from-orange-500/20 to-orange-600/5" },
  { label: "Irritado", icon: Zap, color: "text-red-500", bgColor: "from-red-500/20 to-red-600/5" },
  { label: "Inseguro", icon: Meh, color: "text-yellow-400", bgColor: "from-yellow-500/20 to-yellow-600/5" },
  { label: "Triste", icon: Frown, color: "text-blue-400", bgColor: "from-blue-500/20 to-blue-600/5" },
  { label: "Desanimado", icon: TrendingDown, color: "text-slate-400", bgColor: "from-slate-500/20 to-slate-600/5" },
  { label: "Bem", icon: Smile, color: "text-emerald-400", bgColor: "from-emerald-500/20 to-emerald-600/5" },
  { label: "Confiante", icon: Star, color: "text-amber-400", bgColor: "from-amber-500/20 to-amber-600/5" },
  { label: "Motivado", icon: TrendingUp, color: "text-green-400", bgColor: "from-green-500/20 to-green-600/5" },
  { label: "Calmo", icon: Sunrise, color: "text-cyan-400", bgColor: "from-cyan-500/20 to-cyan-600/5" },
];

const energyOptions: StepOption[] = [
  { label: "Exausto", icon: BatteryLow, color: "text-red-400", bgColor: "from-red-500/20 to-red-600/5" },
  { label: "Cansado", icon: Battery, color: "text-orange-400", bgColor: "from-orange-500/20 to-orange-600/5" },
  { label: "Disposto", icon: BatteryFull, color: "text-emerald-400", bgColor: "from-emerald-500/20 to-emerald-600/5" },
  { label: "Empolgado", icon: BatteryCharging, color: "text-amber-400", bgColor: "from-amber-500/20 to-amber-600/5" },
];

const mindOptions: StepOption[] = [
  { label: "Distraído", icon: CloudMoon, color: "text-slate-400", bgColor: "from-slate-500/20 to-slate-600/5" },
  { label: "Estressado", icon: CloudLightning, color: "text-red-400", bgColor: "from-red-500/20 to-red-600/5" },
  { label: "Baixa Produção", icon: TrendingDown, color: "text-orange-400", bgColor: "from-orange-500/20 to-orange-600/5" },
  { label: "Focado", icon: Focus, color: "text-blue-400", bgColor: "from-blue-500/20 to-blue-600/5" },
  { label: "Criativo", icon: Lightbulb, color: "text-purple-400", bgColor: "from-purple-500/20 to-purple-600/5" },
  { label: "Alta Produção", icon: TrendingUp, color: "text-emerald-400", bgColor: "from-emerald-500/20 to-emerald-600/5" },
];

const sleepOptions: StepOption[] = [
  { label: "Pesadelos", icon: CloudLightning, color: "text-red-400", bgColor: "from-red-500/20 to-red-600/5" },
  { label: "Cansaço ao acordar", icon: BatteryLow, color: "text-orange-400", bgColor: "from-orange-500/20 to-orange-600/5" },
  { label: "Dificuldade para dormir", icon: Moon, color: "text-yellow-400", bgColor: "from-yellow-500/20 to-yellow-600/5" },
  { label: "Adormeci rápido", icon: BedDouble, color: "text-blue-400", bgColor: "from-blue-500/20 to-blue-600/5" },
  { label: "Sono restaurador", icon: Sparkles, color: "text-emerald-400", bgColor: "from-emerald-500/20 to-emerald-600/5" },
  { label: "Sono tranquilo", icon: Star, color: "text-cyan-400", bgColor: "from-cyan-500/20 to-cyan-600/5" },
];

const contextTags = [
  { label: "Trabalho", icon: Briefcase },
  { label: "Família", icon: Users },
  { label: "Saúde", icon: HeartPulse },
  { label: "Relacionamentos", icon: Heart },
  { label: "Outro", icon: MoreHorizontal },
];

const steps = [
  { question: "Como você está se sentindo agora?", options: humorOptions, key: "humor" },
  { question: "Como está sua energia hoje?", options: energyOptions, key: "energy" },
  { question: "Como sua mente está hoje?", options: mindOptions, key: "mind" },
  { question: "Como foi seu sono recentemente?", options: sleepOptions, key: "sleep" },
];

export default function CheckInPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  function selectOption(key: string, value: string) {
    setAnswers({ ...answers, [key]: value });
    if (step < 4) {
      setTimeout(() => {
        setDirection(1);
        setStep(step + 1);
      }, 300);
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/checkins", {
        userId: user.id,
        humor: answers.humor || "Bem",
        energy: answers.energy || "Disposto",
        mind: answers.mind || "Focado",
        sleep: answers.sleep || "Sono tranquilo",
        contextTags: selectedTags,
        notes: notes || null,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/checkins/user", user.id] });
      toast({ title: "Check-in salvo! 🌟", description: "Obrigada por compartilhar como você está." });
      navigate("/dashboard");
    } catch {
      toast({ title: "Erro", description: "Não foi possível salvar o check-in.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (step > 0) {
                setDirection(-1);
                setStep(step - 1);
              } else {
                navigate("/dashboard");
              }
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4" />
            {step > 0 ? "Voltar" : "Início"}
          </button>
          <span className="text-xs text-muted-foreground">{step + 1} de {totalSteps}</span>
        </div>
        <div className="h-1.5 bg-background/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          {step < 4 ? (
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-xl font-bold text-center mb-8 mt-4">
                {steps[step].question}
              </h2>

              <div className={`grid ${steps[step].options.length <= 4 ? "grid-cols-2" : "grid-cols-2"} gap-3`}>
                {steps[step].options.map((opt) => {
                  const isSelected = answers[steps[step].key] === opt.label;
                  return (
                    <motion.button
                      key={opt.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectOption(steps[step].key, opt.label)}
                      className={`relative glass-card rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
                        isSelected
                          ? "border-amber-500/50 bg-amber-500/10"
                          : "hover:border-white/10"
                      }`}
                      data-testid={`option-${opt.label}`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="selected-check"
                          className="absolute top-2 right-2"
                        >
                          <Check className="w-4 h-4 text-amber-400" />
                        </motion.div>
                      )}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.bgColor} flex items-center justify-center`}>
                        <opt.icon className={`w-6 h-6 ${opt.color}`} />
                      </div>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="context"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-xl font-bold text-center mb-2 mt-4">
                Quer compartilhar mais?
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Este espaço é seguro e confidencial.
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {contextTags.map((tag) => {
                  const isActive = selectedTags.includes(tag.label);
                  return (
                    <button
                      key={tag.label}
                      onClick={() => toggleTag(tag.label)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                        isActive
                          ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                          : "glass-card hover:border-white/10"
                      }`}
                      data-testid={`tag-${tag.label}`}
                    >
                      <tag.icon className="w-3.5 h-3.5" />
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              <Textarea
                placeholder="Se quiser desabafar ou compartilhar algo, este espaço é seu... (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] bg-background/40 border-border/40 focus:border-amber-500/40 resize-none rounded-xl"
                data-testid="input-notes"
              />

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-12 mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl border-0 glow-amber"
                data-testid="button-save-checkin"
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Check-in
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
