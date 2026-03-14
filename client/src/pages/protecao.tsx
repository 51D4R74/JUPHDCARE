import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Phone, AlertTriangle, ChevronLeft, Heart,
  Users, Eye, Lock, Scale, Weight, UserX,
  Headphones, Sun, MessageCircleHeart, Sparkles, ShieldAlert,
  Ban, Siren, X, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

const globalRisks = [
  { label: "Assédio Sexual (Art. 216-A CP)", icon: Ban, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
  { label: "Assédio Moral (CLT Art. 483)", icon: ShieldAlert, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
  { label: "Situação Violenta/Traumática", icon: Siren, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
];

const psychSafety = [
  { label: "Falta de clareza", icon: Eye, color: "text-brand-teal", bgColor: "from-brand-teal/20 to-brand-teal/5" },
  { label: "Esforço sem reconhecimento", icon: Heart, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
  { label: "Falta de suporte", icon: Users, color: "text-brand-teal", bgColor: "from-brand-teal/20 to-brand-teal/5" },
  { label: "Falta de autonomia", icon: Lock, color: "text-score-moderate", bgColor: "from-score-moderate/20 to-score-moderate/5" },
  { label: "Sensação de injustiça", icon: Scale, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
  { label: "Sobrecarga", icon: Weight, color: "text-score-critical", bgColor: "from-score-critical/20 to-score-critical/5" },
  { label: "Relações ruins", icon: UserX, color: "text-brand-navy", bgColor: "from-brand-navy/20 to-brand-navy/5" },
  { label: "Isolamento", icon: UserX, color: "text-score-attention", bgColor: "from-score-attention/20 to-score-attention/5" },
];

export default function ProtecaoPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReport, setShowReport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  async function handleSubmitReport() {
    setIsSending(true);
    try {
      await apiRequest("POST", "/api/incidents", {
        userId: user?.id || null,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        description: description || null,
        anonymous: true,
      });
      toast({ title: "Relato enviado", description: "Seu relato foi registrado de forma anônima e segura." });
      setShowReport(false);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setDescription("");
    } catch (error: unknown) {
      console.error("Report submission failed:", error);
      toast({ title: "Erro", description: "Não foi possível enviar o relato.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen gradient-sunrise">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-navy/5 rounded-full blur-[150px]" />
      </div>

      <header className="relative z-10 px-4 pt-6 pb-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back-dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao início
        </button>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-navy/10 border border-brand-navy/15 mb-4">
            <Shield className="w-8 h-8 text-brand-navy" />
          </div>
          <h1 className="text-2xl font-bold">Denúncia</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Este é um espaço seguro e confidencial. Seu relato será anônimo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-score-critical/20 bg-score-critical/5 p-4 mb-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-score-critical/20 to-score-critical/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-score-critical" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-score-critical mb-2">Precisa de ajuda agora?</h3>
            <Button
              onClick={() => setShowCrisis(true)}
              className="bg-gradient-to-r from-score-critical to-score-critical-foreground hover:from-score-critical-foreground hover:to-score-critical text-white border-0 rounded-xl h-10 text-sm"
              data-testid="button-crisis"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Falar com Conselheiro
            </Button>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-score-attention" />
            Mapeamento de Riscos Globais — Relatos Anônimos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {globalRisks.map((risk) => (
              <motion.button
                key={risk.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory("risk");
                  setSelectedSubcategory(risk.label);
                  setShowReport(true);
                }}
                className="glass-card rounded-xl p-4 flex flex-col items-center gap-3 text-center hover:border-brand-navy/15 transition-all"
                data-testid={`risk-${risk.label}`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${risk.bgColor} flex items-center justify-center`}>
                  <risk.icon className={`w-5 h-5 ${risk.color}`} />
                </div>
                <span className="text-xs font-medium leading-tight">{risk.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-score-attention" />
            Segurança Psicológica — Mapeamento de Dores
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {psychSafety.map((item) => (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory("psych");
                  setSelectedSubcategory(item.label);
                  setShowReport(true);
                }}
                className="glass-card rounded-xl p-3 flex items-center gap-3 hover:border-brand-navy/15 transition-all"
                data-testid={`psych-${item.label}`}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-xs font-medium leading-tight text-left">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 glass-card border-t border-border/30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-around">
          <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-home-2">
            <Sun className="w-5 h-5" />
            <span className="text-xs">Início</span>
          </button>
          <button onClick={() => navigate("/checkin")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-checkin-2">
            <MessageCircleHeart className="w-5 h-5" />
            <span className="text-xs">Check-in</span>
          </button>
          <button onClick={() => navigate("/missions")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-missions-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs">Pra Você</span>
          </button>
          <button onClick={() => navigate("/support")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-support-2">
            <Heart className="w-5 h-5" />
            <span className="text-xs">Apoio</span>
          </button>
          <button onClick={() => navigate("/meu-cuidado")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-jornada-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Sua Jornada</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl p-6 border-brand-navy/15"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Relato Anônimo</h3>
                <button onClick={() => setShowReport(false)} className="text-muted-foreground hover:text-foreground" data-testid="button-close-report">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-brand-navy/8 border border-brand-navy/15">
                <Lock className="w-4 h-4 text-brand-navy flex-shrink-0" />
                <p className="text-xs text-brand-navy">Este relato é completamente anônimo e seguro.</p>
              </div>

              <p className="text-sm text-muted-foreground mb-1">Categoria:</p>
              <p className="text-sm font-medium mb-4">{selectedSubcategory}</p>

              <Textarea
                placeholder="Descreva a situação (opcional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] bg-background/40 border-border/40 focus:border-brand-navy/40 resize-none rounded-xl mb-4"
                data-testid="input-report-description"
              />

              <Button
                onClick={handleSubmitReport}
                disabled={isSending}
                className="w-full bg-brand-navy hover:bg-brand-navy-hover text-white border-0 rounded-xl h-11"
                data-testid="button-submit-report"
              >
                {isSending ? "Enviando..." : "Enviar Relato Anônimo"}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {showCrisis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-score-critical/20 bg-white p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-score-critical/10 border border-score-critical/20 mb-4">
                <Headphones className="w-8 h-8 text-score-critical" />
              </div>
              <h3 className="text-lg font-bold mb-2">Conectando ao Atendimento</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Estamos conectando você a um profissional qualificado. Tempo estimado: menos de 60 segundos.
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-score-critical rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="w-2 h-2 bg-score-critical rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  className="w-2 h-2 bg-score-critical rounded-full"
                />
              </div>
              <Button
                onClick={() => setShowCrisis(false)}
                variant="outline"
                className="rounded-xl border-border/50"
                data-testid="button-close-crisis"
              >
                Fechar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
