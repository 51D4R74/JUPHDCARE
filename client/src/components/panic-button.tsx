/**
 * PanicButton — always-visible FAB for anonymous incident reporting.
 *
 * Fixed bottom-right, above bottom nav. Opens a bottom-sheet with
 * critical psychosocial risk categories. Submitting creates an
 * anonymous IncidentReport via POST /api/incidents.
 *
 * Design rationale: victims rarely find courage to report — the
 * button must be visible, accessible, and feel safe at all times.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert, X, Lock,
  Weight, Ban, Award, Brain,
  UserCog, Skull, ShieldCheck,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

// ── Report categories ─────────────────────────────

interface ReportCategory {
  readonly id: string;
  readonly label: string;
  readonly icon: typeof ShieldAlert;
  readonly color: string;
  readonly bgColor: string;
}

const REPORT_CATEGORIES: readonly ReportCategory[] = [
  { id: "sobrecarga", label: "Sobrecarga", icon: Weight, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
  { id: "assedio", label: "Assédio", icon: Ban, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
  { id: "reconhecimento", label: "Reconhecimento", icon: Award, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
  { id: "saude-mental", label: "Saúde Mental", icon: Brain, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
  { id: "lideranca", label: "Liderança", icon: UserCog, color: "text-brand-navy", bgColor: "from-brand-navy/20 to-brand-navy/5" },
  { id: "abuso", label: "Abuso", icon: Skull, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck, color: "text-brand-teal", bgColor: "from-brand-teal/20 to-brand-teal/5" },
] as const;

// ── Component ─────────────────────────────────────

export default function PanicButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ReportCategory | null>(null);
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelected(null);
    setDescription("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selected) return;
    setIsSending(true);
    try {
      await apiRequest("POST", "/api/incidents", {
        userId: user?.id ?? null,
        category: "panic",
        subcategory: selected.label,
        description: description || null,
        anonymous: true,
      });
      toast({
        title: "Relato registrado",
        description: "Seu relato foi enviado de forma anônima e segura. Você não está sozinho(a).",
      });
      handleClose();
    } catch (error: unknown) {
      console.error("Panic report failed:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o relato. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }, [selected, description, user?.id, toast, handleClose]);

  return (
    <>
      {/* FAB — always visible, bottom-right, above bottom nav */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-brand-navy shadow-lg shadow-brand-navy/30 flex items-center justify-center hover:bg-brand-navy-hover active:scale-95 transition-all"
        whileTap={{ scale: 0.9 }}
        aria-label="Botão de proteção — relatar situação"
        data-testid="panic-button"
      >
        <ShieldAlert className="w-6 h-6 text-white" />
      </motion.button>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background border-t border-border/30 p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-brand-navy" />
                  <h2 className="text-lg font-semibold">
                    {selected ? "Descreva a situação" : "O que está acontecendo?"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Fechar"
                  data-testid="panic-close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Privacy notice */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-navy/8 border border-brand-navy/15 mb-5">
                <Lock className="w-4 h-4 text-brand-navy flex-shrink-0" />
                <p className="text-xs text-brand-navy">
                  Totalmente anônimo. Nenhum dado identifica você.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {selected ? (
                  /* Step 2: description + submit */
                  <motion.div
                    key="step-description"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                  >
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl border border-border/40">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${selected.bgColor} flex items-center justify-center`}>
                        <selected.icon className={`w-4 h-4 ${selected.color}`} />
                      </div>
                      <span className="text-sm font-medium">{selected.label}</span>
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                      >
                        Trocar
                      </button>
                    </div>

                    <Textarea
                      placeholder="Descreva a situação (opcional, mas ajuda a entender)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[100px] bg-background/40 border-border/40 focus:border-brand-navy/40 resize-none rounded-xl mb-4"
                      data-testid="panic-description"
                    />

                    <Button
                      onClick={handleSubmit}
                      disabled={isSending}
                      className="w-full bg-brand-navy hover:bg-brand-navy-hover text-white rounded-xl h-12"
                      data-testid="panic-submit"
                    >
                      {isSending ? "Enviando..." : "Enviar relato anônimo"}
                    </Button>

                    <p className="text-[10px] text-muted-foreground text-center mt-3">
                      Você pode enviar sem descrição. A categoria já nos ajuda a agir.
                    </p>
                  </motion.div>
                ) : (
                  /* Step 1: category selection */
                  <motion.div
                    key="step-categories"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {REPORT_CATEGORIES.map((cat) => (
                      <motion.button
                        key={cat.id}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelected(cat)}
                        className="glass-card rounded-xl p-4 flex flex-col items-center gap-2.5 text-center hover:border-brand-navy/15 transition-all"
                        data-testid={`panic-cat-${cat.id}`}
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.bgColor} flex items-center justify-center`}>
                          <cat.icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <span className="text-xs font-medium leading-tight">{cat.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
