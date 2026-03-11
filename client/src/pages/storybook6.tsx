import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbMoodSmile, TbSunHigh } from "react-icons/tb";
import { ArrowRight, CheckCircle2, Cloud, HeartHandshake, Lock, LogOut, Shield, Sparkles, Sun, TimerReset } from "lucide-react";

/*  ─── Variação 3 · Brand Horizon ───────────────────────────────────────
    Paleta extraída diretamente do logotipo JuPhD Care:
      • Azul-marinho   #1E3A5F  (CTA)       — do fundo do emblema
      • Dourado-sol    #F5C542  (acento)     — do sol central
      • Teal-nuvem     #2BA4B5  (detalhe)    — das nuvens/ondas
      • Bronze          #C4954A  (contorno)   — do aro do emblema
    Fundo claro acolhedor, coerente com Dawn Mist e Quiet Sunrise.
    ──────────────────────────────────────────────────────────────────── */

const C = {
  bg: "#F3F1ED",
  surface: "#FAFAF7",
  card: "#FFFFFF",
  border: "#DDD8D2",
  text: "#1A2744",
  textSec: "#5E6D7C",
  navy: "#1E3A5F",
  navyHover: "#152C4A",
  gold: "#F5C542",
  goldSoft: "#FFF6D9",
  goldGlow: "rgba(245,197,66,0.55)",
  teal: "#2BA4B5",
  tealSoft: "#E3F2F5",
  cloudA: "#E8EDF2",
  cloudB: "#D5E1EA",
  cloudC: "#B5CBD8",
  protect: "#8A5A5A",
  protectBg: "#F4ECEA",
  protectBorder: "#E0CCC9",
  bronze: "#C4954A",
} as const;

function TrustChip({ icon: Icon, label }: Readonly<{ icon: typeof Lock; label: string }>) {
  return (
    <div
      className="flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-sm"
      style={{ borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.72)", color: C.textSec, boxShadow: "0 10px 25px rgba(26,39,68,0.05)" }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: C.navy }} />
      {label}
    </div>
  );
}

export default function Storybook6Page() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden" style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', Inter, sans-serif" }}>
      <div className="relative overflow-hidden">
        {/* ── Sky gradient ── */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 8%, ${C.goldSoft} 0%, transparent 26%),
              radial-gradient(circle at 22% 22%, ${C.cloudA} 0%, transparent 18%),
              radial-gradient(circle at 78% 18%, ${C.cloudB} 0%, transparent 20%),
              linear-gradient(180deg, #F8F5F0 0%, ${C.bg} 52%, #F6F3EE 100%)
            `,
          }}
        />
        {/* ── Sol (gold from logo) ── */}
        <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full" style={{ background: `${C.gold}cc`, filter: "blur(10px)" }} />
        {/* ── Nuvens (teal-blue tones from logo) ── */}
        <div className="absolute left-[12%] top-28 h-28 w-56 rounded-full" style={{ background: C.cloudA, filter: "blur(2px)" }} />
        <div className="absolute right-[10%] top-24 h-32 w-72 rounded-full" style={{ background: C.cloudB, filter: "blur(2px)" }} />
        <div className="absolute left-1/2 top-36 h-24 w-80 -translate-x-1/2 rounded-full" style={{ background: `${C.bg}e6`, filter: "blur(2px)" }} />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
          {/* ── Header ── */}
          <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 14px 30px rgba(26,39,68,0.08)" }}>
                <Sun className="h-5 w-5" style={{ color: C.navy }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: C.textSec }}>JuPhD Care</p>
                <p className="text-sm font-semibold">Variação 3 · Brand Horizon</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/storybook4" className="text-sm underline underline-offset-4" style={{ color: C.textSec, textDecorationColor: C.border }}>Proposta principal</a>
              <a href="/storybook5" className="text-sm underline underline-offset-4" style={{ color: C.textSec, textDecorationColor: C.border }}>Variação 2</a>
              <button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.72)", color: C.textSec, boxShadow: "0 10px 25px rgba(26,39,68,0.05)" }}>
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </header>

          {/* ── Hero ── */}
          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div className="space-y-6">
              <Badge className="border px-4 py-1.5" style={{ borderColor: C.border, background: "rgba(255,255,255,0.78)", color: C.textSec, boxShadow: "0 10px 25px rgba(26,39,68,0.05)" }}>
                Entre Nuvens, Há Cuidado
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-xl text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
                  Como você está{" "}
                  <span style={{ color: C.navy }}>hoje</span>?
                </h1>
                <p className="max-w-xl text-lg leading-relaxed" style={{ color: C.textSec }}>
                  Seu check-in leva poucos minutos e nos ajuda a cuidar melhor de você, com confidencialidade e atenção.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <TrustChip icon={Lock} label="Confidencial" />
                <TrustChip icon={TimerReset} label="Poucos minutos" />
                <TrustChip icon={HeartHandshake} label="Apoio quando necessário" />
              </div>
            </div>

            {/* ── Sol & nuvem illustration card ── */}
            <div className="relative h-[320px] overflow-hidden rounded-[38px] border backdrop-blur-sm" style={{ borderColor: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.5)", boxShadow: "0 30px 80px rgba(26,39,68,0.08)" }}>
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 22%, ${C.goldSoft} 0%, transparent 22%), linear-gradient(180deg,rgba(255,255,255,0.3),rgba(243,241,237,0.15))` }}
              />
              <div className="absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full" style={{ background: `${C.gold}e6`, boxShadow: `0 0 80px ${C.goldGlow}` }} />
              <div className="absolute left-10 top-32 h-24 w-44 rounded-full" style={{ background: C.cloudA, boxShadow: "0 20px 30px rgba(26,39,68,0.04)" }} />
              <div className="absolute right-8 top-28 h-28 w-56 rounded-full" style={{ background: C.cloudB, boxShadow: "0 20px 30px rgba(26,39,68,0.05)" }} />
              <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.78)", color: C.textSec }}>
                <Cloud className="h-3.5 w-3.5" style={{ color: C.teal }} />
                Estado neutro equilibrado
              </div>
            </div>
          </div>

          {/* ── Check-in + Proteção ── */}
          <div className="mt-10 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[34px] border p-6 md:p-7" style={{ borderColor: C.border, background: C.surface, boxShadow: "0 24px 60px rgba(26,39,68,0.06)" }}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: C.textSec }}>Check-in de hoje</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">Reserve alguns minutos para registrar como você está.</h2>
                </div>
                <Badge className="whitespace-nowrap border px-3 py-1" style={{ borderColor: C.border, background: C.bg, color: C.textSec }}>
                  Leva cerca de 3 min
                </Badge>
              </div>
              <p className="max-w-xl text-sm leading-relaxed" style={{ color: C.textSec }}>
                Suas respostas nos ajudam a acompanhar seu bem-estar com mais cuidado. Nenhuma informação individual é compartilhada fora do contexto adequado.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button className="h-12 rounded-full px-7 text-sm font-semibold" style={{ background: C.navy, color: "#F9F7F3" }} onMouseEnter={e => (e.currentTarget.style.background = C.navyHover)} onMouseLeave={e => (e.currentTarget.style.background = C.navy)}>
                  Fazer check-in <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-sm" style={{ color: C.textSec }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color: C.teal }} />
                  Ainda não realizado hoje
                </div>
              </div>
            </section>

            <section className="rounded-[34px] border p-6 md:p-7" style={{ borderColor: C.protectBorder, background: C.protectBg, boxShadow: "0 24px 60px rgba(26,39,68,0.05)" }}>
              <div className="mb-4 flex items-center gap-2" style={{ color: C.protect }}>
                <Shield className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.18em]">Cuidado e proteção</p>
              </div>
              <h2 className="text-2xl font-semibold leading-tight">Precisa relatar uma situação séria?</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6F5B5B" }}>
                Se estiver vivendo assédio, violência, ameaça ou outra situação sensível, este canal é confidencial e tratado com cuidado.
              </p>
              <Button variant="outline" className="mt-6 h-12 rounded-full px-6 text-sm font-semibold" style={{ borderColor: C.protectBorder, background: "rgba(255,255,255,0.7)", color: C.protect }}>
                Acessar canal de proteção
              </Button>
            </section>
          </div>

          {/* ── Continuidade + Paleta ── */}
          <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[30px] border p-6" style={{ borderColor: C.border, background: "rgba(255,255,255,0.72)", boxShadow: "0 22px 50px rgba(26,39,68,0.05)" }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: C.textSec }}>Continuidade</p>
                  <h3 className="mt-1 text-lg font-semibold">Último check-in</h3>
                </div>
                <Sparkles className="h-4 w-4" style={{ color: C.navy }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <p className="text-xs" style={{ color: C.textSec }}>Humor</p>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl border bg-white shadow-[0_10px_24px_rgba(26,39,68,0.05)]" style={{ borderColor: C.border }}>
                    <TbMoodSmile className="h-5 w-5" style={{ color: C.navy }} />
                  </div>
                  <p className="mt-2 text-sm font-medium">Estável</p>
                </div>
                <div className="rounded-[22px] border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <p className="text-xs" style={{ color: C.textSec }}>Energia</p>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl border bg-white shadow-[0_10px_24px_rgba(26,39,68,0.05)]" style={{ borderColor: C.border }}>
                    <TbSunHigh className="h-5 w-5" style={{ color: C.gold }} />
                  </div>
                  <p className="mt-2 text-sm font-medium">Disposta</p>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border p-6" style={{ borderColor: C.border, background: C.surface, boxShadow: "0 22px 50px rgba(26,39,68,0.05)" }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: C.textSec }}>Paleta</p>
                  <h3 className="mt-1 text-lg font-semibold">Cores extraídas do logotipo</h3>
                </div>
                <Badge className="border px-3 py-1" style={{ borderColor: C.border, background: C.bg, color: C.textSec }}>Brand Horizon</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {/* Swatches */}
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.bg }}>
                  <div className="h-10 w-10 shrink-0 rounded-lg" style={{ background: C.navy }} />
                  <div>
                    <p className="text-sm font-medium">Azul-marinho</p>
                    <p className="text-xs" style={{ color: C.textSec }}>CTA principal · {C.navy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.bg }}>
                  <div className="h-10 w-10 shrink-0 rounded-lg" style={{ background: C.gold }} />
                  <div>
                    <p className="text-sm font-medium">Dourado sol</p>
                    <p className="text-xs" style={{ color: C.textSec }}>Acento quente · {C.gold}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.bg }}>
                  <div className="h-10 w-10 shrink-0 rounded-lg" style={{ background: C.teal }} />
                  <div>
                    <p className="text-sm font-medium">Teal nuvem</p>
                    <p className="text-xs" style={{ color: C.textSec }}>Detalhe positivo · {C.teal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: C.bg }}>
                  <div className="h-10 w-10 shrink-0 rounded-lg" style={{ background: C.protect }} />
                  <div>
                    <p className="text-sm font-medium">Vinho terroso</p>
                    <p className="text-xs" style={{ color: C.textSec }}>Proteção · {C.protect}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Racional ── */}
          <section className="mt-5 rounded-[30px] border p-6" style={{ borderColor: C.border, background: C.surface, boxShadow: "0 22px 50px rgba(26,39,68,0.05)" }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: C.textSec }}>Racional</p>
                <h3 className="mt-1 text-lg font-semibold">Por que esta variação funciona</h3>
              </div>
              <Badge className="border px-3 py-1" style={{ borderColor: C.border, background: C.bg, color: C.textSec }}>v3</Badge>
            </div>
            <div className="grid gap-3 text-sm leading-relaxed md:grid-cols-2" style={{ color: C.textSec }}>
              <p>O azul-marinho transmite solidez institucional sem frieza — é a mesma cor âncora do logotipo.</p>
              <p>O sol e as nuvens mantêm a identidade da marca sem competir com o CTA.</p>
              <p>O dourado entra como detalhe quente, não como cor de ação — evita confusão com alertas.</p>
              <p>A coerência com as duas propostas anteriores facilita mixar elementos entre variações.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
