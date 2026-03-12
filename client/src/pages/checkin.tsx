import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import {
  type CheckInStep,
  type StepOption,
  type ProjectionCard,
  type ProjectionOption,
  type ScoreDomainId,
  DAILY_STEPS,
  SCORE_DOMAINS,
  CHAT_TRIGGERS,
  detectChatTrigger,
  collectFlags,
  computeDomainScores,
  deriveSkyState,
} from "@/lib/checkin-data";
import ScoreCard from "@/components/score-card";
import SkyHeader from "@/components/sky-header";

// ── Slide animation variants ──────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

// ── Sub-components ────────────────────────────────

function OptionCard({
  option,
  selected,
  onClick,
  compact,
}: Readonly<{
  option: StepOption;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}>) {
  const Icon = option.icon;
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 rounded-xl transition-all border ${
        compact ? "p-3" : "p-4"
      } ${
        selected
          ? "border-primary/40 bg-primary/8"
          : "glass-card hover:border-black/5"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${option.bgColor} ring-1 ring-black/5 flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`w-5 h-5 ${option.color}`} />
      </div>
      <span
        className={`text-sm leading-tight ${
          selected ? "font-semibold text-foreground" : "text-foreground"
        }`}
      >
        {option.label}
      </span>
      {selected && (
        <motion.div layoutId="check-mark" className="ml-auto">
          <Check className="w-4 h-4 text-primary" />
        </motion.div>
      )}
    </motion.button>
  );
}

function TagPill({
  option,
  selected,
  onClick,
}: Readonly<{
  option: StepOption;
  selected: boolean;
  onClick: () => void;
}>) {
  const Icon = option.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
        selected
          ? "bg-primary/10 border border-primary/30 text-primary font-medium"
          : "glass-card hover:border-black/5 text-muted-foreground"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {option.label}
    </button>
  );
}

function ProjectionCardView({
  card,
  onAnswer,
  selected,
}: Readonly<{
  card: ProjectionCard;
  onAnswer: (opt: ProjectionOption) => void;
  selected: string | null;
}>) {
  return (
    <div className="mt-4 p-4 rounded-xl border border-dashed border-accent/30 bg-accent/5">
      <div className="flex items-start gap-3 mb-3">
        <MessageCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground leading-snug">
            {card.text}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{card.sublabel}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {card.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs transition-all border ${
              selected === opt.id
                ? "border-primary/30 bg-primary/8 font-semibold text-foreground"
                : "glass-card text-muted-foreground hover:border-black/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FollowUpView({
  question,
  value,
  onChange,
}: Readonly<{
  question: string;
  value: string | null;
  onChange: (v: string) => void;
}>) {
  const opts = ["Sim", "Mais ou menos", "Não"];
  return (
    <div className="mt-3 p-4 rounded-xl bg-background/40 border border-border/40">
      <p className="text-sm text-muted-foreground mb-3">{question}</p>
      <div className="flex gap-2">
        {opts.map((label) => (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs transition-all border ${
              value === label
                ? "border-primary/30 bg-primary/8 font-semibold text-foreground"
                : "glass-card text-muted-foreground hover:border-black/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatTriggerModal({
  triggerId,
  onClose,
  onOpen,
}: Readonly<{
  triggerId: string | null;
  onClose: () => void;
  onOpen: () => void;
}>) {
  if (!triggerId) return null;
  const t = CHAT_TRIGGERS[triggerId] ?? CHAT_TRIGGERS.pressured;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-4">
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-card rounded-2xl p-6 w-full max-w-md"
      >
        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-7 h-7 text-accent" />
          </div>
        </div>
        <p className="text-foreground text-sm leading-relaxed text-center whitespace-pre-line mb-3">
          {t.message}
        </p>
        <p className="text-xs text-muted-foreground text-center mb-5 flex items-center gap-1.5 justify-center">
          <Lock className="w-3 h-3" /> {t.anonymousNote}
        </p>
        <Button
          onClick={onOpen}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl border-0"
        >
          {t.cta}
        </Button>
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Agora não
        </button>
      </motion.div>
    </div>
  );
}

// ── StepView — renders one question step ──────────

function StepView({
  step,
  onAnswer,
  previousAnswer,
}: Readonly<{
  step: CheckInStep;
  onAnswer: (
    stepId: string,
    answer: string | string[],
    projAnswer?: ProjectionOption | null,
    followUp?: string | null,
  ) => void;
  previousAnswer?: string | string[];
}>) {
  const [selected, setSelected] = useState<string | string[]>(
    previousAnswer ??
      (step.type === "multi3" || step.type === "multi2" || step.type === "tags"
        ? []
        : ""),
  );
  const [projAnswer, setProjAnswer] = useState<ProjectionOption | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);

  const handleSingle = (opt: StepOption) => {
    setSelected(opt.id);
    setTimeout(() => onAnswer(step.id, opt.id, projAnswer, followUp), 280);
  };

  const handleMulti = (opt: StepOption, max: number) => {
    if (opt.exclusive) {
      setSelected([opt.id]);
      return;
    }
    let next = Array.isArray(selected)
      ? selected.filter((s) => s !== "nothing" && s !== "all_good")
      : [];
    if (next.includes(opt.id)) {
      next = next.filter((s) => s !== opt.id);
    } else if (next.length < max) {
      next = [...next, opt.id];
    }
    setSelected(next);
  };

  const isMultiSelected = (id: string) =>
    Array.isArray(selected) && selected.includes(id);
  const canContinue = Array.isArray(selected)
    ? selected.length > 0
    : selected !== "";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground leading-tight mb-1">
          {step.question}
        </h2>
        {step.sublabel && (
          <p className="text-xs text-muted-foreground leading-snug">
            {step.sublabel}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* Single / Projection */}
        {(step.type === "single" || step.type === "projection") &&
          step.options.map((opt) => (
            <OptionCard
              key={opt.id}
              option={opt}
              selected={selected === opt.id}
              onClick={() => handleSingle(opt)}
            />
          ))}

        {/* Multi */}
        {(step.type === "multi3" || step.type === "multi2") && (
          <>
            {step.options.map((opt) => (
              <OptionCard
                key={opt.id}
                option={opt}
                selected={isMultiSelected(opt.id)}
                onClick={() =>
                  handleMulti(opt, step.type === "multi3" ? 3 : 2)
                }
                compact={step.type === "multi2"}
              />
            ))}
            {step.projectionCard && (
              <ProjectionCardView
                card={step.projectionCard}
                onAnswer={setProjAnswer}
                selected={projAnswer?.id ?? null}
              />
            )}
            {canContinue && (
              <Button
                onClick={() =>
                  onAnswer(step.id, selected, projAnswer, followUp)
                }
                className="mt-2 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl border-0"
              >
                Continuar
              </Button>
            )}
          </>
        )}

        {/* Tags */}
        {step.type === "tags" && (
          <>
            <div className="flex flex-wrap gap-2">
              {step.options.map((opt) => (
                <TagPill
                  key={opt.id}
                  option={opt}
                  selected={isMultiSelected(opt.id)}
                  onClick={() => handleMulti(opt, 5)}
                />
              ))}
            </div>
            <Button
              onClick={() =>
                onAnswer(step.id, selected, projAnswer, followUp)
              }
              className={`mt-2 h-12 rounded-xl border-0 font-semibold ${
                canContinue
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-background/40 text-muted-foreground"
              }`}
            >
              {canContinue ? "Continuar" : "Pular"}
            </Button>
          </>
        )}

        {/* Follow-up */}
        {step.followUp && selected !== "" && (
          <FollowUpView
            question={step.followUp.question}
            value={followUp}
            onChange={setFollowUp}
          />
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────

type Phase = "intro" | "checkin" | "done";

export default function CheckInPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [phase, setPhase] = useState<Phase>("intro");
  const [chatTrigger, setChatTrigger] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [finalScores, setFinalScores] = useState<Record<ScoreDomainId, number> | null>(null);

  const steps = DAILY_STEPS;
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  const saveCheckIn = useCallback(
    async (finalAnswers: Record<string, string | string[]>) => {
      if (!user) return;
      setIsSaving(true);
      try {
        const domainScores = computeDomainScores(finalAnswers);
        const flags = collectFlags(finalAnswers, steps);
        setFinalScores(domainScores);

        // DEBT: migrate to POST /api/checkins (new format) when backend ready
        await apiRequest("POST", "/api/moment-checkins", {
          userId: user.id,
          moment: "daily",
          answers: JSON.stringify(finalAnswers),
          scores: JSON.stringify(domainScores),
          flags: flags.length > 0 ? flags : null,
          chatTriggered: chatTrigger !== null,
        });
        queryClient.invalidateQueries({
          queryKey: ["/api/moment-checkins/user", user.id, "today"],
        });
        toast({
          title: "Check-in salvo!",
          description: "Obrigada por compartilhar como você está.",
        });
        setPhase("done");
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível salvar o check-in.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [user, steps, chatTrigger, toast],
  );

  const handleAnswer = useCallback(
    (
      stepId: string,
      answer: string | string[],
      projAnswer?: ProjectionOption | null,
      _followUp?: string | null,
    ) => {
      if (isSaving) return;
      const newAnswers = { ...answers, [stepId]: answer };
      setAnswers(newAnswers);

      // Detect chat trigger
      const trigger = detectChatTrigger(stepId, answer, steps, projAnswer);
      if (trigger) {
        setChatTrigger(trigger);
        return;
      }

      if (currentStep < steps.length - 1) {
        setDirection(1);
        setCurrentStep((s) => s + 1);
      } else {
        saveCheckIn(newAnswers);
      }
    },
    [answers, currentStep, steps, saveCheckIn, isSaving],
  );

  const handleChatTriggerClose = useCallback(() => {
    setChatTrigger(null);
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      saveCheckIn(answers);
    }
  }, [currentStep, steps.length, answers, saveCheckIn]);

  const handleChatTriggerOpen = useCallback(() => {
    setChatTrigger(null);
    // DEBT: integrate with real chatbot [feature/chatbot]
    navigate("/protecao");
  }, [navigate]);

  // Greeting based on time
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Derive sky state from final scores for done screen
  const skyResult = finalScores
    ? deriveSkyState(finalScores, collectFlags(answers, steps))
    : null;

  // Build contributors for score cards
  const buildContributors = (domain: typeof SCORE_DOMAINS[number]) =>
    domain.questionIds.map((qId) => {
      const step = steps.find((s) => s.id === qId);
      const val = answers[qId];
      let ids: string[];
      if (val == null) ids = [];
      else if (Array.isArray(val)) ids = val;
      else ids = [val];
      const opt = step?.options.find((o) => ids.includes(o.id));
      return {
        label: step?.question ?? qId,
        value: opt?.score ?? 0,
        maxValue: 4,
      };
    });

  let backLabel = "Dashboard";
  if (phase === "checkin" && currentStep > 0) backLabel = "Voltar";
  else if (phase === "checkin") backLabel = "Início";

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (phase === "checkin" && currentStep > 0) {
                setDirection(-1);
                setCurrentStep((s) => s - 1);
              } else if (phase === "checkin") {
                setPhase("intro");
              } else {
                navigate("/dashboard");
              }
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4" />
            {backLabel}
          </button>
          {phase === "checkin" && (
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} de {steps.length}
            </span>
          )}
        </div>
        {phase === "checkin" && (
          <div className="h-1.5 bg-background/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          {/* INTRO */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {greeting()} ☀️
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Como foi seu dia?
              </p>

              <div className="glass-card rounded-2xl p-5 mb-4">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Check-in diário
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  6 perguntas rápidas sobre sono, energia, trabalho e bem-estar.
                  Leva menos de 2 minutos.
                </p>
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    setDirection(1);
                    setAnswers({});
                    setPhase("checkin");
                  }}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl border-0 glow-amber"
                >
                  Fazer check-in agora →
                </Button>
              </div>

              {/* Emergency/protection button */}
              <button
                onClick={() => navigate("/protecao")}
                className="w-full p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive font-semibold text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
              >
                🛡️ Cuidado e Proteção — Situação Séria
              </button>

              <div className="mt-5 p-4 rounded-xl bg-background/30 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                  Privacidade
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Suas respostas são confidenciais. Nenhuma informação individual
                  chega ao RH sem sua autorização explícita.
                </p>
              </div>
            </motion.div>
          )}

          {/* CHECKIN: step by step */}
          {phase === "checkin" && (
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepView
                step={steps[currentStep]}
                onAnswer={handleAnswer}
                previousAnswer={answers[steps[currentStep].id]}
              />
            </motion.div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-4"
            >
              {/* Sky feedback */}
              {skyResult && (
                <SkyHeader
                  skyState={skyResult.skyState}
                  solarHaloLevel={skyResult.solarHaloLevel}
                  size="hero"
                  className="mb-6"
                />
              )}

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Registrado com cuidado
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Seus dados ajudam a construir um padrão ao longo do tempo.
                </p>
              </div>

              {/* Domain scores */}
              {finalScores && (
                <div className="space-y-3 mb-6">
                  {SCORE_DOMAINS.map((domain) => (
                    <ScoreCard
                      key={domain.id}
                      domainId={domain.id}
                      title={domain.label}
                      description={domain.description}
                      score={finalScores[domain.id]}
                      contributors={buildContributors(domain)}
                    />
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center mb-5 flex items-center gap-1.5 justify-center">
                <Lock className="w-3 h-3" /> Nenhuma informação individual vai ao RH sem sua autorização.
              </p>

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl border-0"
              >
                Voltar ao dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Chat trigger modal */}
      <AnimatePresence>
        {chatTrigger && (
          <ChatTriggerModal
            triggerId={chatTrigger}
            onClose={handleChatTriggerClose}
            onOpen={handleChatTriggerOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
