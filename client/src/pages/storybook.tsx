import { useState } from "react";
import { type IconType } from "react-icons";
import { TbAlertTriangle, TbBattery1, TbBolt, TbEye, TbHeart, TbMoodSad, TbMoodSmile, TbMoonStars, TbShieldCheck, TbSparkles } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Heart, Shield, AlertTriangle, Check, X, Phone, Bell, Star,
  ChevronRight, Sparkles, Sun, Eye, Send, Zap,
  Users, Activity, TrendingUp, Info, CircleAlert,
  ArrowRight, Leaf, Brain, BarChart3, Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Section({ id, title, subtitle, children }: Readonly<{ id: string; title: string; subtitle?: string; children: React.ReactNode }>) {
  return (
    <section id={id} className="scroll-mt-24 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-base max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ label, bg, border }: Readonly<{ label: string; bg: string; border?: boolean }>) {
  return (
    <div className="group flex flex-col items-center gap-2.5">
      <div className={`w-16 h-16 rounded-2xl ${bg} ${border ? "border-2 border-border" : "border border-white/5"} transition-transform duration-200 group-hover:scale-110`} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function StorybookPage() {
  const [progress] = useState(72);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Design System</span>
          </div>
          <Badge variant="outline" className="text-xs font-medium">v0.2 · Violet + Rose</Badge>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-sunrise" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-sm px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5" /> JuPhD Care
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Bem-estar que{" "}
              <span className="text-gradient-warm">transforma</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Sistema de design para uma plataforma de saúde mental corporativa. Cada cor, forma e interação foi pensada para acolher.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white border-0 h-12 px-8 rounded-xl font-semibold shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:shadow-violet-500/30">
                <Send className="w-4 h-4" /> Explorar Componentes
              </Button>
              <Button variant="outline" className="h-12 px-8 rounded-xl font-semibold">
                <Eye className="w-4 h-4" /> Ver Paleta
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* ================================================================
            1. COLOR PALETTE
        ================================================================ */}
        <Section id="palette" title="Paleta de Cores" subtitle="Violet como base, Rose como calor, Teal como vitalidade. Cada cor tem papel semântico.">
          {/* Primary: Violet */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-widest">Primary · Violet</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="50" bg="bg-violet-50" />
              <Swatch label="100" bg="bg-violet-100" />
              <Swatch label="200" bg="bg-violet-200" />
              <Swatch label="300" bg="bg-violet-300" />
              <Swatch label="400" bg="bg-violet-400" />
              <Swatch label="500" bg="bg-violet-500" />
              <Swatch label="600" bg="bg-violet-600" />
              <Swatch label="700" bg="bg-violet-700" />
              <Swatch label="800" bg="bg-violet-800" />
              <Swatch label="900" bg="bg-violet-900" />
            </div>
          </div>

          {/* Warm: Rose */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">Warm Accent · Rose</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="50" bg="bg-rose-50" />
              <Swatch label="100" bg="bg-rose-100" />
              <Swatch label="200" bg="bg-rose-200" />
              <Swatch label="300" bg="bg-rose-300" />
              <Swatch label="400" bg="bg-rose-400" />
              <Swatch label="500" bg="bg-rose-500" />
              <Swatch label="600" bg="bg-rose-600" />
              <Swatch label="700" bg="bg-rose-700" />
              <Swatch label="800" bg="bg-rose-800" />
              <Swatch label="900" bg="bg-rose-900" />
            </div>
          </div>

          {/* Success: Teal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-widest">Wellness · Teal</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="50" bg="bg-teal-50" />
              <Swatch label="100" bg="bg-teal-100" />
              <Swatch label="200" bg="bg-teal-200" />
              <Swatch label="300" bg="bg-teal-300" />
              <Swatch label="400" bg="bg-teal-400" />
              <Swatch label="500" bg="bg-teal-500" />
              <Swatch label="600" bg="bg-teal-600" />
              <Swatch label="700" bg="bg-teal-700" />
              <Swatch label="800" bg="bg-teal-800" />
              <Swatch label="900" bg="bg-teal-900" />
            </div>
          </div>

          {/* Semantic tokens */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Tokens Semânticos</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="primary" bg="bg-primary" />
              <Swatch label="secondary" bg="bg-secondary" />
              <Swatch label="accent" bg="bg-accent" />
              <Swatch label="muted" bg="bg-muted" />
              <Swatch label="destructive" bg="bg-destructive" />
              <Swatch label="background" bg="bg-background" border />
              <Swatch label="card" bg="bg-card" />
            </div>
          </div>

          {/* Chart + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Chart</h3>
              <div className="flex flex-wrap gap-3">
                <Swatch label="1" bg="bg-chart-1" />
                <Swatch label="2" bg="bg-chart-2" />
                <Swatch label="3" bg="bg-chart-3" />
                <Swatch label="4" bg="bg-chart-4" />
                <Swatch label="5" bg="bg-chart-5" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Status + Warning</h3>
              <div className="flex flex-wrap gap-3">
                <Swatch label="online" bg="bg-status-online" />
                <Swatch label="away" bg="bg-status-away" />
                <Swatch label="busy" bg="bg-status-busy" />
                <Swatch label="offline" bg="bg-status-offline" />
                <Swatch label="amber-400" bg="bg-amber-400" />
                <Swatch label="amber-500" bg="bg-amber-500" />
              </div>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            2. TYPOGRAPHY
        ================================================================ */}
        <Section id="typography" title="Tipografia" subtitle="DM Sans — geometric humanist, legível de 12px a 64px. Pesos 400–700 para hierarquia clara.">
          <div className="space-y-10 max-w-3xl">
            <div className="space-y-6">
              <p className="text-6xl font-bold tracking-tight leading-[1.1]">Cuidar é um ato de<br /><span className="text-gradient-warm">coragem</span></p>
              <p className="text-4xl font-bold tracking-tight">Heading 1 — Gestão de Riscos Psicossociais</p>
              <p className="text-2xl font-semibold">Heading 2 — Como você está se sentindo hoje?</p>
              <p className="text-xl font-medium">Heading 3 — Selecione a emoção que melhor descreve seu momento.</p>
              <p className="text-base">Body — Suas respostas são 100% confidenciais e nos ajudam a cuidar melhor de você. Nenhum dado individual é compartilhado com a liderança.</p>
              <p className="text-sm text-muted-foreground">Small — Texto auxiliar com legibilidade garantida em telas pequenas e grandes.</p>
              <p className="text-xs text-muted-foreground">Micro — Labels, timestamps, metadata. Deve ser legível mesmo a 12px.</p>
            </div>

            {/* Weight showcase */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Pesos</h3>
              <div className="space-y-2">
                <p className="text-2xl font-normal">Regular 400 — Texto corrido, descrições</p>
                <p className="text-2xl font-medium">Medium 500 — Labels, navegação</p>
                <p className="text-2xl font-semibold">Semibold 600 — Subtítulos, destaques</p>
                <p className="text-2xl font-bold">Bold 700 — Títulos, métricas, CTAs</p>
              </div>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            3. GRADIENTS & EFFECTS
        ================================================================ */}
        <Section id="effects" title="Gradientes & Efeitos" subtitle="Profundidade e calor no dark mode.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-44 rounded-2xl gradient-sunrise flex items-end p-5 border border-white/5">
              <span className="text-sm font-medium text-muted-foreground">.gradient-sunrise</span>
            </div>
            <div className="h-44 rounded-2xl gradient-dusk flex items-end p-5 border border-white/5">
              <span className="text-sm font-medium text-muted-foreground">.gradient-dusk</span>
            </div>
            <div className="h-44 rounded-2xl bg-gradient-to-br from-violet-500/15 via-rose-500/10 to-teal-500/5 flex items-end p-5 border border-white/5">
              <span className="text-sm font-medium text-muted-foreground">violet → rose → teal</span>
            </div>
          </div>

          {/* Text gradients */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Gradientes de texto</h3>
            <div className="flex flex-wrap gap-8 items-baseline">
              <span className="text-4xl font-bold text-gradient-warm">violet → rose</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">teal → emerald</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">violet → indigo</span>
            </div>
          </div>

          {/* Glows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 rounded-2xl bg-card border border-card-border glow-violet flex items-center justify-center">
              <span className="text-sm font-medium">.glow-violet</span>
            </div>
            <div className="h-28 rounded-2xl bg-card border border-card-border glow-rose flex items-center justify-center">
              <span className="text-sm font-medium">.glow-rose</span>
            </div>
            <div className="h-28 rounded-2xl bg-card border border-card-border glow-amber flex items-center justify-center">
              <span className="text-sm font-medium">.glow-amber (warning)</span>
            </div>
          </div>

          {/* Glass */}
          <div className="relative h-48 rounded-2xl overflow-hidden gradient-sunrise">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-rose-500/5" />
            <div className="absolute inset-6 glass-card rounded-2xl flex items-center justify-center">
              <span className="text-sm font-medium">.glass-card sobre gradient-sunrise</span>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            4. BUTTONS
        ================================================================ */}
        <Section id="buttons" title="Botões" subtitle="Todas as variantes + CTAs com gradiente quente.">
          {/* Standard */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Variantes padrão</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="default"><Heart className="w-4 h-4" /> Primary</Button>
              <Button variant="secondary"><Shield className="w-4 h-4" /> Secondary</Button>
              <Button variant="outline"><Eye className="w-4 h-4" /> Outline</Button>
              <Button variant="ghost"><Info className="w-4 h-4" /> Ghost</Button>
              <Button variant="destructive"><X className="w-4 h-4" /> Destructive</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Tamanhos</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Star className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Disabled */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Desabilitados</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button disabled>Primary</Button>
              <Button variant="secondary" disabled>Secondary</Button>
              <Button variant="outline" disabled>Outline</Button>
              <Button variant="destructive" disabled>Destructive</Button>
            </div>
          </div>

          {/* Gradient CTAs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">CTA com gradiente</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button className="bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white border-0 h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:shadow-violet-500/30">
                <Send className="w-5 h-5" /> Enviar Check-in
              </Button>
              <Button className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:shadow-xl hover:shadow-violet-500/30">
                <TrendingUp className="w-5 h-5" /> Ver Relatórios
              </Button>
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white border-0 h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:shadow-xl hover:shadow-teal-500/30">
                <Leaf className="w-5 h-5" /> Bem-estar
              </Button>
            </div>
          </div>

          {/* Emergency */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Emergência</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-red-500/20 rounded-2xl animate-pulse" />
                <Button className="relative bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white border-0 h-14 px-10 text-lg font-bold rounded-2xl shadow-lg shadow-red-500/25">
                  <Phone className="w-6 h-6" /> Pedir Ajuda Agora
                </Button>
              </div>
              <Button className="bg-transparent border-2 border-red-500/60 text-red-400 hover:bg-red-500/10 h-14 px-10 text-lg font-bold rounded-2xl transition-colors">
                <CircleAlert className="w-6 h-6" /> Preciso de Suporte
              </Button>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            5. CARDS
        ================================================================ */}
        <Section id="cards" title="Cards" subtitle="O bloco fundamental. Cada card responde ao hover com elevação e brilho sutil.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Standard */}
            <Card className="group transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-violet-500/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-violet-400" />
                  </div>
                  Card Padrão
                </CardTitle>
                <CardDescription>Bloco base do sistema de interface.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Hover eleva o card com sombra e borda sutil. Transição suave de 300ms.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">
                  Ação <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </CardFooter>
            </Card>

            {/* Glass */}
            <div className="group glass-card rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-rose-400" />
                  </div>
                  Glass Card
                </CardTitle>
                <CardDescription>Frosted glass com backdrop-blur.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ideal sobre fundos com gradiente. Profundidade sem peso visual.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="bg-white/5 hover:bg-white/10 text-foreground border-0">
                  Explorar <Sparkles className="w-4 h-4" />
                </Button>
              </CardFooter>
            </div>

            {/* Glow */}
            <Card className="group glow-violet border-violet-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(155,105,210,0.25)]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-violet-400" />
                  </div>
                  Card com Glow
                </CardTitle>
                <CardDescription>Destaque para ações prioritárias.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Glow violet sutil chama atenção sem agredir a composição.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Começar <ChevronRight className="w-4 h-4" /></Button>
              </CardFooter>
            </Card>

            {/* Metric */}
            <Card className="group transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Bem-estar Geral</span>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold tracking-tight">78<span className="text-2xl text-muted-foreground">%</span></p>
                <p className="text-sm text-teal-400 mt-2 font-medium">↑ 5% vs semana passada</p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: "78%" }} />
                </div>
              </CardContent>
            </Card>

            {/* Check-in summary */}
            <Card className="group border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] via-card to-rose-500/5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Último Check-in</CardTitle>
                  <Badge className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs">Hoje</Badge>
                </div>
                <CardDescription>14:32 · Confiante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sentindo-se bem</p>
                    <p className="text-xs text-muted-foreground">Energia: {progress}%</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="group border-red-500/20 bg-gradient-to-br from-red-500/5 to-card transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-400">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  Alerta Crítico
                </CardTitle>
                <CardDescription>Canal de suporte imediato.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Estamos aqui para ajudar. Toque para falar com alguém agora, 100% confidencial.</p>
              </CardContent>
              <CardFooter>
                <Button className="bg-red-600 hover:bg-red-700 text-white border-0 w-full font-semibold">
                  <Phone className="w-4 h-4" /> Falar com Alguém
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            6. BADGES
        ================================================================ */}
        <Section id="badges" title="Badges" subtitle="Categorização visual com cores semânticas.">
          <div className="flex flex-wrap gap-3">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20">Bem-estar ↑</Badge>
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">Cuidado</Badge>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Atenção</Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Informação</Badge>
            <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">Novo</Badge>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            7. EMOTION GRID
        ================================================================ */}
        <Section id="emotions" title="Grid de Emoções" subtitle="Preview do check-in. Cada emoção tem identidade cromática própria.">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: TbMoodSmile, label: "Bem", bg: "from-teal-500/15 to-teal-600/5", border: "border-teal-500/20 hover:border-teal-400/40", text: "text-teal-400", glow: "hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]" },
              { icon: TbMoonStars, label: "Calmo", bg: "from-blue-500/15 to-blue-600/5", border: "border-blue-500/20 hover:border-blue-400/40", text: "text-blue-400", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
              { icon: TbMoodSad, label: "Triste", bg: "from-slate-500/15 to-slate-600/5", border: "border-slate-500/20 hover:border-slate-400/40", text: "text-slate-400", glow: "hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]" },
              { icon: TbAlertTriangle, label: "Ansioso", bg: "from-amber-500/15 to-amber-600/5", border: "border-amber-500/20 hover:border-amber-400/40", text: "text-amber-400", glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
              { icon: TbBolt, label: "Irritado", bg: "from-red-500/15 to-red-600/5", border: "border-red-500/20 hover:border-red-400/40", text: "text-red-400", glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
              { icon: TbSparkles, label: "Empolgado", bg: "from-violet-500/15 to-violet-600/5", border: "border-violet-500/20 hover:border-violet-400/40", text: "text-violet-400", glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]" },
              { icon: TbBattery1, label: "Cansado", bg: "from-indigo-500/15 to-indigo-600/5", border: "border-indigo-500/20 hover:border-indigo-400/40", text: "text-indigo-400", glow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]" },
              { icon: TbShieldCheck, label: "Confiante", bg: "from-emerald-500/15 to-emerald-600/5", border: "border-emerald-500/20 hover:border-emerald-400/40", text: "text-emerald-400", glow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]" },
              { icon: TbEye, label: "Neutro", bg: "from-zinc-500/15 to-zinc-600/5", border: "border-zinc-500/20 hover:border-zinc-400/40", text: "text-zinc-400", glow: "hover:shadow-[0_0_20px_rgba(161,161,170,0.15)]" },
              { icon: TbHeart, label: "Grato", bg: "from-rose-500/15 to-rose-600/5", border: "border-rose-500/20 hover:border-rose-400/40", text: "text-rose-400", glow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]" },
            ].map((e: { icon: IconType; label: string; bg: string; border: string; text: string; glow: string }) => (
              <button
                key={e.label}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border bg-gradient-to-b ${e.bg} ${e.border} ${e.glow} hover:scale-105 transition-all duration-200 cursor-pointer`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <e.icon className={`h-6 w-6 ${e.text}`} />
                </div>
                <span className={`text-sm font-semibold ${e.text}`}>{e.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            8. INPUTS & FORM CONTROLS
        ================================================================ */}
        <Section id="forms" title="Formulários" subtitle="Campos e controles interativos.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="exemplo@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label>Desabilitado</Label>
              <Input disabled placeholder="Campo desabilitado" />
            </div>
            <div className="space-y-2">
              <Label>Com foco violet</Label>
              <Input placeholder="Toque para ver o ring" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="confidential" />
              <Label htmlFor="confidential">Respostas confidenciais</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              <Label>Notificações {switchOn ? "ativadas" : "desativadas"}</Label>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-lg space-y-5 mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Energia</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2.5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bem-estar</span>
                <span className="font-medium text-teal-400">88%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risco</span>
                <span className="font-medium text-rose-400">42%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-400 to-red-400 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            9. ALERTS
        ================================================================ */}
        <Section id="alerts" title="Alertas" subtitle="Feedback contextual — informação, sucesso, atenção, perigo.">
          <div className="grid gap-4 max-w-2xl">
            <Alert className="border-blue-500/20 bg-blue-500/5 text-blue-200 [&>svg]:text-blue-400">
              <Info className="h-4 w-4" />
              <AlertTitle className="font-semibold">Informação</AlertTitle>
              <AlertDescription>Seu próximo check-in está agendado para amanhã às 9h.</AlertDescription>
            </Alert>
            <Alert className="border-teal-500/20 bg-teal-500/5 text-teal-200 [&>svg]:text-teal-400">
              <Check className="h-4 w-4" />
              <AlertTitle className="font-semibold">Sucesso</AlertTitle>
              <AlertDescription>Check-in registrado com sucesso. Obrigado por compartilhar!</AlertDescription>
            </Alert>
            <Alert className="border-amber-500/20 bg-amber-500/5 text-amber-200 [&>svg]:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Atenção</AlertTitle>
              <AlertDescription>Notamos uma queda no seu bem-estar. Que tal conversar com alguém?</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle className="font-semibold">Perigo</AlertTitle>
              <AlertDescription>Se você está em crise, ligue para o CVV: 188 (24h, gratuito e confidencial).</AlertDescription>
            </Alert>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            10. COMPOSITE: Mini Dashboard
        ================================================================ */}
        <Section id="dashboard" title="Composição: Dashboard" subtitle="Preview de como os componentes se combinam num layout real.">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: metrics + chart */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Check-ins", value: "24", icon: Heart, trend: "+3", color: "violet" },
                  { label: "Bem-estar", value: "78%", icon: TrendingUp, trend: "+5%", color: "teal" },
                  { label: "Participação", value: "92%", icon: Users, trend: "+2%", color: "blue" },
                  { label: "Alertas", value: "2", icon: AlertTriangle, trend: "-1", color: "amber" },
                ].map((m) => (
                  <Card key={m.label} className="transition-all duration-300 hover:-translate-y-0.5">
                    <CardContent className="pt-5 pb-4 px-5">
                      <div className="flex items-center justify-between mb-2">
                        <m.icon className={`w-4 h-4 text-${m.color}-400`} />
                        <span className={`text-xs font-medium text-${m.color}-400`}>{m.trend}</span>
                      </div>
                      <p className="text-2xl font-bold">{m.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chart placeholder */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Evolução Semanal</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">7 dias</Badge>
                      <Badge className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs">30 dias</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-2 pt-4">
                    {[40, 55, 45, 62, 58, 72, 78].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full rounded-lg bg-gradient-to-t from-violet-500/30 to-violet-400/10 transition-all duration-500 hover:from-violet-500/50 hover:to-violet-400/20"
                          style={{ height: `${v * 1.8}px` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: activity feed */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" /> Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { time: "14:32", text: "Check-in: Sentindo-se bem", icon: Sun, color: "text-teal-400" },
                    { time: "11:15", text: "Badge: 7 dias seguidos", icon: Star, color: "text-violet-400" },
                    { time: "09:00", text: "Lembrete de check-in matinal", icon: Bell, color: "text-blue-400" },
                    { time: "Ontem", text: "Módulo concluído: Respiração", icon: Brain, color: "text-rose-400" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                        <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm">{a.text}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick action */}
              <Card className="border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-rose-500/5">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Hora do check-in</p>
                    <p className="text-sm text-muted-foreground">Como você está agora?</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white border-0 rounded-xl font-semibold shadow-lg shadow-violet-500/20">
                    <Sparkles className="w-4 h-4" /> Fazer Check-in
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            11. BOTTOM NAV
        ================================================================ */}
        <Section id="nav" title="Bottom Nav" subtitle="Navegação mobile com indicador primário.">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-card border border-card-border shadow-xl">
              {[
                { icon: Sun, label: "Início", active: false },
                { icon: Heart, label: "Check-in", active: true },
                { icon: Shield, label: "Proteção", active: false },
                { icon: BarChart3, label: "Dados", active: false },
                { icon: Users, label: "Perfil", active: false },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${item.active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            12. CTA
        ================================================================ */}
        <Section id="cta" title="Hero CTA" subtitle="Seção de chamada para ação.">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-sunrise" />
            <div className="absolute inset-0 gradient-dusk opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/[0.08] rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-rose-500/[0.08] rounded-full blur-3xl" />
            <div className="relative z-10 py-16 md:py-24 px-8 text-center max-w-xl mx-auto space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-rose-500 shadow-xl shadow-violet-500/25">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Como você está{" "}<span className="text-gradient-warm">hoje</span>?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Reserve um momento para registrar como se sente. Suas respostas são 100% confidenciais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button className="bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white border-0 h-14 px-10 text-base font-semibold rounded-2xl shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/30">
                  <Sparkles className="w-5 h-5" /> Fazer Meu Check-in
                </Button>
                <Button variant="outline" className="h-14 px-10 text-base font-semibold rounded-2xl border-white/10 hover:bg-white/5">
                  Saber Mais <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center py-12 text-sm text-muted-foreground space-y-1">
          <p className="font-medium">JuPhD Care · Design System v0.2</p>
          <p>Violet + Rose · DM Sans · Dark Mode</p>
        </div>
      </div>
    </div>
  );
}
