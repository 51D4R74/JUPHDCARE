import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Eye, EyeOff, Mail, Lock, ArrowRight, Check, X, Sparkles, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

function PasswordCriteria({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs" data-testid={`criteria-${label}`}>
      {met ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <X className="w-3.5 h-3.5 text-muted-foreground/50" />
      )}
      <span className={met ? "text-emerald-400" : "text-muted-foreground/60"}>{label}</span>
    </div>
  );
}

type ViewMode = "login" | "register" | "forgot";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<ViewMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);

  const criteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const allCriteriaMet = Object.values(criteria).every(Boolean);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { username: email, password });
      const user = await res.json();
      setUser(user);
      toast({ title: "Bem-vinda!", description: "Login realizado com sucesso." });
      if (user.role === "rh") {
        navigate("/rh");
      } else {
        navigate("/dashboard");
      }
    } catch {
      toast({ title: "Erro", description: "Credenciais inválidas. Verifique seu email e senha.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({ title: "Atenção", description: "Preencha nome, email e senha.", variant: "destructive" });
      return;
    }
    if (!allCriteriaMet) {
      toast({ title: "Senha fraca", description: "A senha precisa atender todos os critérios de segurança.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", {
        username: email,
        password,
        name,
        department: department || null,
      });
      const user = await res.json();
      setUser(user);
      toast({ title: "Conta criada!", description: `Bem-vinda, ${user.name}!` });
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.message?.includes("409") ? "Este email já está cadastrado." : "Não foi possível criar a conta. Tente novamente.";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  function handleCodeInput(index: number, value: string) {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...resetCode];
    newCode[index] = value;
    setResetCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  }

  function switchView(newView: ViewMode) {
    setView(newView);
    setEmail("");
    setPassword("");
    setName("");
    setDepartment("");
    setShowPassword(false);
  }

  return (
    <div className="min-h-screen gradient-sunrise flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 glow-amber"
          >
            <Sun className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gradient-warm"
          >
            JuPhD Care
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-1 text-sm"
          >
            Gestão de Riscos Psicossociais
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-lg font-semibold text-foreground">Seja muito bem-vinda!</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-amber-500/50 h-11"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-amber-500/50 h-11"
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-xl border-0"
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => switchView("forgot")}
                  className="text-sm text-muted-foreground hover:text-amber-400 transition-colors"
                  data-testid="link-forgot-password"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                <p className="text-sm text-center text-muted-foreground mb-3">Ainda não tem conta?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => switchView("register")}
                  className="w-full h-11 rounded-xl border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                  data-testid="button-go-to-register"
                >
                  <User className="w-4 h-4 mr-2" />
                  Criar nova conta
                </Button>
              </div>
            </motion.div>
          )}

          {view === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-lg font-semibold text-foreground">Criar sua conta</h2>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-sm text-muted-foreground">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="Maria Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-amber-500/50 h-11"
                      data-testid="input-reg-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm text-muted-foreground">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-amber-500/50 h-11"
                      data-testid="input-reg-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-department" className="text-sm text-muted-foreground">Departamento (opcional)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-department"
                      type="text"
                      placeholder="Ex: Marketing, TI, Vendas..."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-amber-500/50 h-11"
                      data-testid="input-reg-department"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm text-muted-foreground">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-amber-500/50 h-11"
                      data-testid="input-reg-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid grid-cols-2 gap-1.5 p-3 rounded-lg bg-background/30"
                  >
                    <PasswordCriteria label="8+ caracteres" met={criteria.length} />
                    <PasswordCriteria label="Maiúscula" met={criteria.upper} />
                    <PasswordCriteria label="Minúscula" met={criteria.lower} />
                    <PasswordCriteria label="Número" met={criteria.number} />
                    <PasswordCriteria label="Especial (!@#)" met={criteria.special} />
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email || !password || !name || !allCriteriaMet}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-xl border-0"
                  data-testid="button-register"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Criar conta
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t border-border/30 text-center">
                <button
                  onClick={() => switchView("login")}
                  className="text-sm text-muted-foreground hover:text-amber-400 transition-colors"
                  data-testid="link-back-to-login"
                >
                  Já tem uma conta? <span className="text-amber-400/80 font-medium">Entrar</span>
                </button>
              </div>
            </motion.div>
          )}

          {view === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-8"
            >
              <h2 className="text-lg font-semibold mb-2">Recuperar senha</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Digite o código de 6 dígitos enviado para o seu e-mail.
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {resetCode.map((digit, i) => (
                  <Input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold bg-background/50 border-border/50 focus:border-amber-500/50"
                    data-testid={`input-code-${i}`}
                  />
                ))}
              </div>

              <Button
                onClick={() => {
                  toast({ title: "Código verificado!", description: "Sua senha foi redefinida (simulação)." });
                  switchView("login");
                  setResetCode(["", "", "", "", "", ""]);
                }}
                className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-xl border-0"
                data-testid="button-verify-code"
              >
                Verificar código
              </Button>

              <button
                onClick={() => switchView("login")}
                className="w-full text-center mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-back-from-forgot"
              >
                Voltar ao login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
