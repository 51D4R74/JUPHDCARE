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
  Heart, Shield, AlertTriangle, Check, X, Phone, Star,
  ChevronRight, Sparkles, Sun, Eye, Send, Zap,
  Users, Activity, TrendingUp, Info, CircleAlert,
  ArrowRight, Leaf, Brain, BarChart3, Clock, Coffee,
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

function Swatch({ label, bg, ring }: Readonly<{ label: string; bg: string; ring?: boolean }>) {
  return (
    <div className="group flex flex-col items-center gap-2.5">
      <div className={`w-16 h-16 rounded-2xl ${bg} ${ring ? "ring-1 ring-black/10" : ""} shadow-sm transition-transform duration-200 group-hover:scale-110`} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page — wraps everything in .theme-light to override CSS vars
// ---------------------------------------------------------------------------
export default function Storybook2Page() {
  const [progress] = useState(72);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <div className="theme-light min-h-screen bg-background text-foreground" style={{ colorScheme: "light" }}>
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl" style={{ borderColor: "hsl(30 15% 88%)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C52BE] to-[#98C3A0] flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Design System v0.3</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-medium bg-white">Light Mode</Badge>
            <a href="/storybook" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">← v0.2 Dark</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-sunrise-light" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#7C52BE]/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#98C3A0]/[0.06] rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-[#7C52BE]/10 text-[#7C52BE] border-[#7C52BE]/20 text-sm px-4 py-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> JuPhD Care
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Bem-estar que{" "}
              <span className="text-gradient-warm">transforma</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Fundo claro, tipografia firme, paleta mínima. Baseado em benchmark de 8 líderes de mercado em saúde mental corporativa.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-[#7C52BE] hover:bg-[#6B45A8] text-white border-0 h-12 px-8 rounded-xl font-semibold shadow-md shadow-[#7C52BE]/15 transition-all hover:shadow-lg hover:shadow-[#7C52BE]/20">
                <Send className="w-4 h-4" /> Explorar Componentes
              </Button>
              <Button variant="outline" className="h-12 px-8 rounded-xl font-semibold border-black/10 hover:bg-black/[0.03]">
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
        <Section id="palette" title="Paleta de Cores" subtitle="Off-white quente como base. Violet como acento único. Sage para bem-estar. Mínima e harmoniosa.">
          {/* Base tones */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Base · Warm Neutrals</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="bg" bg="bg-[#FAF9F7]" ring />
              <Swatch label="card" bg="bg-white" ring />
              <Swatch label="border" bg="bg-[#E8E4DF]" />
              <Swatch label="muted" bg="bg-[#F0EDE9]" />
              <Swatch label="text" bg="bg-[#1A1A2E]" />
              <Swatch label="subtle" bg="bg-[#6B7280]" />
            </div>
          </div>

          {/* Primary: Violet */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#7C52BE] uppercase tracking-widest">Primary · Violet</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="50" bg="bg-[#F5F0FF]" />
              <Swatch label="100" bg="bg-[#EDE5FF]" />
              <Swatch label="200" bg="bg-[#D4C4F0]" />
              <Swatch label="300" bg="bg-[#B69DE0]" />
              <Swatch label="400" bg="bg-[#9B7BD0]" />
              <Swatch label="500" bg="bg-[#7C52BE]" />
              <Swatch label="600" bg="bg-[#6B45A8]" />
              <Swatch label="700" bg="bg-[#553690]" />
              <Swatch label="800" bg="bg-[#402878]" />
              <Swatch label="900" bg="bg-[#2D1B60]" />
            </div>
          </div>

          {/* Wellness: Sage */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#5B8A65] uppercase tracking-widest">Wellness · Sage Green</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="50" bg="bg-[#F0F7F1]" />
              <Swatch label="100" bg="bg-[#DCEEDE]" />
              <Swatch label="200" bg="bg-[#B8D9BC]" />
              <Swatch label="300" bg="bg-[#98C3A0]" />
              <Swatch label="400" bg="bg-[#78AA82]" />
              <Swatch label="500" bg="bg-[#5B8A65]" />
              <Swatch label="600" bg="bg-[#4A7354]" />
              <Swatch label="700" bg="bg-[#3A5C43]" />
              <Swatch label="800" bg="bg-[#2A4532]" />
              <Swatch label="900" bg="bg-[#1A2E21]" />
            </div>
          </div>

          {/* Semantic */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Semânticos</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="primary" bg="bg-primary" />
              <Swatch label="secondary" bg="bg-secondary" ring />
              <Swatch label="accent" bg="bg-accent" ring />
              <Swatch label="muted" bg="bg-muted" />
              <Swatch label="destructive" bg="bg-destructive" />
              <Swatch label="background" bg="bg-background" ring />
              <Swatch label="card" bg="bg-card" ring />
            </div>
          </div>

          {/* Warning + Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Warning & Status</h3>
            <div className="flex flex-wrap gap-3">
              <Swatch label="warning" bg="bg-amber-400" />
              <Swatch label="danger" bg="bg-red-500" />
              <Swatch label="info" bg="bg-blue-500" />
              <Swatch label="online" bg="bg-emerald-500" />
              <Swatch label="offline" bg="bg-gray-400" />
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            2. TYPOGRAPHY
        ================================================================ */}
        <Section id="typography" title="Tipografia" subtitle="DM Sans — corpo firme e legível. Nada leve, nada fino. Hierarchia com peso, não com decoração.">
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
            3. GRADIENTS & EFFECTS (light mode)
        ================================================================ */}
        <Section id="effects" title="Gradientes & Efeitos" subtitle="Suaves e mínimos. Light mode não precisa de show — precisa de clareza.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-44 rounded-2xl gradient-sunrise-light flex items-end p-5 ring-1 ring-black/5">
              <span className="text-sm font-medium text-muted-foreground">.gradient-sunrise-light</span>
            </div>
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#7C52BE]/[0.06] to-[#98C3A0]/[0.04] flex items-end p-5 ring-1 ring-black/5">
              <span className="text-sm font-medium text-muted-foreground">violet → sage</span>
            </div>
            <div className="h-44 rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-[#F0F7F1] flex items-end p-5 ring-1 ring-black/5">
              <span className="text-sm font-medium text-muted-foreground">lavender → mint</span>
            </div>
          </div>

          {/* Text gradients */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Gradientes de texto</h3>
            <div className="flex flex-wrap gap-8 items-baseline">
              <span className="text-4xl font-bold text-gradient-warm">violet → sage</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-[#7C52BE] to-[#9B7BD0] bg-clip-text text-transparent">violet monocromático</span>
            </div>
          </div>

          {/* Shadows & glass */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"].map((s) => (
              <div key={s} className={`h-24 rounded-2xl bg-white ${s} ring-1 ring-black/5 flex items-center justify-center`}>
                <span className="text-xs font-medium text-muted-foreground">.{s}</span>
              </div>
            ))}
          </div>

          <div className="relative h-48 rounded-2xl overflow-hidden gradient-sunrise-light">
            <div className="absolute inset-6 glass-card rounded-2xl flex items-center justify-center">
              <span className="text-sm font-medium">.glass-card (light mode)</span>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            4. BUTTONS
        ================================================================ */}
        <Section id="buttons" title="Botões" subtitle="Um acento. Violet para ação, outline para secundário. Sem gradiente arco-íris.">
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
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">CTAs</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button className="bg-[#7C52BE] hover:bg-[#6B45A8] text-white border-0 h-12 px-8 text-base font-semibold rounded-xl shadow-md shadow-[#7C52BE]/15 transition-all hover:shadow-lg hover:shadow-[#7C52BE]/20">
                <Send className="w-5 h-5" /> Enviar Check-in
              </Button>
              <Button className="bg-[#5B8A65] hover:bg-[#4A7354] text-white border-0 h-12 px-8 text-base font-semibold rounded-xl shadow-md shadow-[#5B8A65]/15 transition-all hover:shadow-lg hover:shadow-[#5B8A65]/20">
                <Leaf className="w-5 h-5" /> Bem-estar
              </Button>
              <Button variant="outline" className="h-12 px-8 text-base font-semibold rounded-xl border-black/10 hover:bg-black/[0.03]">
                <TrendingUp className="w-5 h-5" /> Ver Relatórios
              </Button>
            </div>
          </div>

          {/* Emergency */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Emergência</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white border-0 h-14 px-10 text-lg font-bold rounded-2xl shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/30">
                <Phone className="w-6 h-6" /> Pedir Ajuda Agora
              </Button>
              <Button className="bg-transparent border-2 border-red-500/60 text-red-600 hover:bg-red-50 h-14 px-10 text-lg font-bold rounded-2xl transition-colors">
                <CircleAlert className="w-6 h-6" /> Preciso de Suporte
              </Button>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            5. CARDS
        ================================================================ */}
        <Section id="cards" title="Cards" subtitle="Brancos sobre fundo off-white. Sombra sutil eleva no hover. Sem glow, sem brilho — clareza.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Standard */}
            <Card className="group bg-white ring-1 ring-black/5 border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F0FF] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#7C52BE]" />
                  </div>
                  Card Padrão
                </CardTitle>
                <CardDescription>Bloco base do sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Fundo branco, sombra leve, hover eleva. Sem bordas agressivas.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="group-hover:text-[#7C52BE] transition-colors">
                  Ação <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </CardFooter>
            </Card>

            {/* Accent */}
            <Card className="group bg-white ring-1 ring-[#7C52BE]/15 border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-[#7C52BE]/25">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F0FF] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#7C52BE]" />
                  </div>
                  Card Destaque
                </CardTitle>
                <CardDescription>Borda primária sutil p/ ações importantes.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ring violet em vez de glow. Clean e profissional.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Começar <ChevronRight className="w-4 h-4" /></Button>
              </CardFooter>
            </Card>

            {/* Wellness */}
            <Card className="group bg-[#F0F7F1] ring-1 ring-[#5B8A65]/15 border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DCEEDE] flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#5B8A65]" />
                  </div>
                  Card Bem-estar
                </CardTitle>
                <CardDescription>Fundo sage sutil para contextos positivos.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Usado em métricas de melhoria e conquistas.</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-[#5B8A65] hover:text-[#4A7354] hover:bg-[#DCEEDE]">
                  Ver Progresso <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Metric */}
            <Card className="group bg-white ring-1 ring-black/5 border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Bem-estar Geral</span>
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F1] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#5B8A65]" />
                  </div>
                </div>
                <p className="text-4xl font-bold tracking-tight">78<span className="text-2xl text-muted-foreground">%</span></p>
                <p className="text-sm text-[#5B8A65] mt-2 font-medium">↑ 5% vs semana passada</p>
                <div className="mt-4 h-2.5 w-full rounded-full bg-[#F0F7F1] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#98C3A0] to-[#5B8A65] rounded-full" style={{ width: "78%" }} />
                </div>
              </CardContent>
            </Card>

            {/* Check-in summary */}
            <Card className="group bg-gradient-to-br from-[#F5F0FF] to-white ring-1 ring-[#7C52BE]/10 border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Último Check-in</CardTitle>
                  <Badge className="bg-[#F5F0FF] text-[#7C52BE] border-[#7C52BE]/15 text-xs">Hoje</Badge>
                </div>
                <CardDescription>14:32 · Confiante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F7F1] flex items-center justify-center">
                    <Sun className="w-5 h-5 text-[#5B8A65]" />
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
            <Card className="group bg-red-50 ring-1 ring-red-200 border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-red-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  Alerta Crítico
                </CardTitle>
                <CardDescription className="text-red-600/70">Canal de suporte imediato.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600/70">Estamos aqui para ajudar. Toque para falar com alguém agora, 100% confidencial.</p>
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
        <Section id="badges" title="Badges" subtitle="Cores semânticas com fundo tinted sutil.">
          <div className="flex flex-wrap gap-3">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-[#F0F7F1] text-[#5B8A65] border-[#5B8A65]/15">Bem-estar ↑</Badge>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200">Atenção</Badge>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">Informação</Badge>
            <Badge className="bg-[#F5F0FF] text-[#7C52BE] border-[#7C52BE]/15">Novo</Badge>
            <Badge className="bg-red-50 text-red-700 border-red-200">Urgente</Badge>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            7. EMOTION GRID
        ================================================================ */}
        <Section id="emotions" title="Grid de Emoções" subtitle="O momento de cor. Cada emoção tem identidade cromática — aqui, e só aqui, a paleta explode.">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: TbMoodSmile, label: "Bem", bg: "bg-emerald-50", border: "ring-emerald-200 hover:ring-emerald-300", text: "text-emerald-700" },
              { icon: TbMoonStars, label: "Calmo", bg: "bg-blue-50", border: "ring-blue-200 hover:ring-blue-300", text: "text-blue-700" },
              { icon: TbMoodSad, label: "Triste", bg: "bg-slate-100", border: "ring-slate-200 hover:ring-slate-300", text: "text-slate-600" },
              { icon: TbAlertTriangle, label: "Ansioso", bg: "bg-amber-50", border: "ring-amber-200 hover:ring-amber-300", text: "text-amber-700" },
              { icon: TbBolt, label: "Irritado", bg: "bg-red-50", border: "ring-red-200 hover:ring-red-300", text: "text-red-700" },
              { icon: TbSparkles, label: "Empolgado", bg: "bg-[#F5F0FF]", border: "ring-[#D4C4F0] hover:ring-[#B69DE0]", text: "text-[#7C52BE]" },
              { icon: TbBattery1, label: "Cansado", bg: "bg-indigo-50", border: "ring-indigo-200 hover:ring-indigo-300", text: "text-indigo-700" },
              { icon: TbShieldCheck, label: "Confiante", bg: "bg-[#F0F7F1]", border: "ring-[#B8D9BC] hover:ring-[#98C3A0]", text: "text-[#5B8A65]" },
              { icon: TbEye, label: "Neutro", bg: "bg-gray-100", border: "ring-gray-200 hover:ring-gray-300", text: "text-gray-600" },
              { icon: TbHeart, label: "Grato", bg: "bg-pink-50", border: "ring-pink-200 hover:ring-pink-300", text: "text-pink-700" },
            ].map((e: { icon: IconType; label: string; bg: string; border: string; text: string }) => (
              <button
                key={e.label}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl ${e.bg} ring-1 ${e.border} hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-black/5 shadow-[0_8px_20px_rgba(17,24,39,0.06)]">
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
        <Section id="forms" title="Formulários" subtitle="Campos limpos com ring de foco violet.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Seu nome completo" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="exemplo@empresa.com" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label>Desabilitado</Label>
              <Input disabled placeholder="Campo desabilitado" />
            </div>
            <div className="space-y-2">
              <Label>Com foco</Label>
              <Input placeholder="Toque para ver o ring violet" className="bg-white" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="confidential2" />
              <Label htmlFor="confidential2">Respostas confidenciais</Label>
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
                <span className="font-medium text-[#5B8A65]">88%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#F0F7F1] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#98C3A0] to-[#5B8A65] rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risco</span>
                <span className="font-medium text-red-600">42%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-red-50 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            9. ALERTS
        ================================================================ */}
        <Section id="alerts" title="Alertas" subtitle="Feedback contextual com fundo tinted e ícone colorido.">
          <div className="grid gap-4 max-w-2xl">
            <Alert className="border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600">
              <Info className="h-4 w-4" />
              <AlertTitle className="font-semibold">Informação</AlertTitle>
              <AlertDescription className="text-blue-800/80">Seu próximo check-in está agendado para amanhã às 9h.</AlertDescription>
            </Alert>
            <Alert className="border-[#B8D9BC] bg-[#F0F7F1] text-[#2A4532] [&>svg]:text-[#5B8A65]">
              <Check className="h-4 w-4" />
              <AlertTitle className="font-semibold">Sucesso</AlertTitle>
              <AlertDescription className="text-[#3A5C43]">Check-in registrado com sucesso. Obrigado por compartilhar!</AlertDescription>
            </Alert>
            <Alert className="border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Atenção</AlertTitle>
              <AlertDescription className="text-amber-800/80">Notamos uma queda no seu bem-estar. Que tal conversar com alguém?</AlertDescription>
            </Alert>
            <Alert className="border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle className="font-semibold">Perigo</AlertTitle>
              <AlertDescription className="text-red-800/80">Se você está em crise, ligue para o CVV: 188 (24h, gratuito e confidencial).</AlertDescription>
            </Alert>
          </div>
        </Section>

        <Separator className="opacity-30" />

        {/* ================================================================
            10. COMPOSITE: Mini Dashboard
        ================================================================ */}
        <Section id="dashboard" title="Composição: Dashboard" subtitle="Preview de layout real — metric cards + gráfico + atividade.">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: metrics + chart */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Check-ins", value: "24", icon: Heart, trend: "+3", color: "#7C52BE", bgLight: "#F5F0FF" },
                  { label: "Bem-estar", value: "78%", icon: TrendingUp, trend: "+5%", color: "#5B8A65", bgLight: "#F0F7F1" },
                  { label: "Participação", value: "92%", icon: Users, trend: "+2%", color: "#3B82F6", bgLight: "#EFF6FF" },
                  { label: "Alertas", value: "2", icon: AlertTriangle, trend: "-1", color: "#D97706", bgLight: "#FFFBEB" },
                ].map((m) => (
                  <Card key={m.label} className="bg-white ring-1 ring-black/5 border-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="pt-5 pb-4 px-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.bgLight }}>
                          <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: m.color }}>{m.trend}</span>
                      </div>
                      <p className="text-2xl font-bold">{m.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Chart placeholder */}
              <Card className="bg-white ring-1 ring-black/5 border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Evolução Semanal</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs bg-white">7 dias</Badge>
                      <Badge className="bg-[#F5F0FF] text-[#7C52BE] border-[#7C52BE]/15 text-xs">30 dias</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-2 pt-4">
                    {[40, 55, 45, 62, 58, 72, 78].map((v, i) => (
                      <div key={["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full rounded-lg bg-gradient-to-t from-[#7C52BE]/20 to-[#7C52BE]/5 transition-all duration-300 hover:from-[#7C52BE]/35 hover:to-[#7C52BE]/10"
                          style={{ height: `${v * 1.8}px` }}
                        />
                        <span className="text-[10px] text-muted-foreground font-medium">{["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: activity feed */}
            <div className="space-y-6">
              <Card className="bg-white ring-1 ring-black/5 border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" /> Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { time: "14:32", text: "Check-in: Sentindo-se bem", icon: Sun, color: "#5B8A65", bg: "#F0F7F1" },
                    { time: "11:15", text: "Badge: 7 dias seguidos", icon: Star, color: "#7C52BE", bg: "#F5F0FF" },
                    { time: "09:00", text: "Lembrete de check-in matinal", icon: Coffee, color: "#D97706", bg: "#FFFBEB" },
                    { time: "Ontem", text: "Módulo concluído: Respiração", icon: Brain, color: "#3B82F6", bg: "#EFF6FF" },
                  ].map((a) => (
                    <div key={a.text} className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.bg }}>
                        <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
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
              <Card className="bg-gradient-to-br from-[#F5F0FF] to-[#F0F7F1] ring-1 ring-[#7C52BE]/10 border-0 shadow-sm">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-[#7C52BE] flex items-center justify-center shadow-md shadow-[#7C52BE]/20">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Hora do check-in</p>
                    <p className="text-sm text-muted-foreground">Como você está agora?</p>
                  </div>
                  <Button className="w-full bg-[#7C52BE] hover:bg-[#6B45A8] text-white border-0 rounded-xl font-semibold shadow-md shadow-[#7C52BE]/15">
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
        <Section id="nav" title="Bottom Nav" subtitle="Navegação mobile com fundo branco e indicador violet.">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-white ring-1 ring-black/5 shadow-lg">
              {[
                { icon: Sun, label: "Início", active: false },
                { icon: Heart, label: "Check-in", active: true },
                { icon: Shield, label: "Proteção", active: false },
                { icon: BarChart3, label: "Dados", active: false },
                { icon: Users, label: "Perfil", active: false },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${item.active ? "text-[#7C52BE] bg-[#F5F0FF]" : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03]"}`}>
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
            12. HERO CTA
        ================================================================ */}
        <Section id="cta" title="Hero CTA" subtitle="Seção de chamada para ação.">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0FF] via-white to-[#F0F7F1]" />
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#7C52BE]/[0.04] rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#98C3A0]/[0.06] rounded-full blur-3xl" />
            <div className="relative z-10 py-16 md:py-24 px-8 text-center max-w-xl mx-auto space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#7C52BE] shadow-xl shadow-[#7C52BE]/20">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Como você está{" "}<span className="text-gradient-warm">hoje</span>?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Reserve um momento para registrar como se sente. Suas respostas são 100% confidenciais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button className="bg-[#7C52BE] hover:bg-[#6B45A8] text-white border-0 h-14 px-10 text-base font-semibold rounded-2xl shadow-lg shadow-[#7C52BE]/20 transition-all hover:shadow-xl hover:shadow-[#7C52BE]/25">
                  <Sparkles className="w-5 h-5" /> Fazer Meu Check-in
                </Button>
                <Button variant="outline" className="h-14 px-10 text-base font-semibold rounded-2xl border-black/10 hover:bg-black/[0.03]">
                  Saber Mais <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center py-12 text-sm text-muted-foreground space-y-1">
          <p className="font-medium">JuPhD Care · Design System v0.3</p>
          <p>Light Mode · Violet + Sage · DM Sans</p>
        </div>
      </div>
    </div>
  );
}
