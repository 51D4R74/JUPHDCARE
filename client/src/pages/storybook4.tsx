import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbMoodSmile, TbSunHigh } from "react-icons/tb";
import { ArrowRight, CheckCircle2, Cloud, HeartHandshake, Lock, LogOut, Shield, Sparkles, Sun, TimerReset } from "lucide-react";

function TrustPill({ icon: Icon, label }: Readonly<{ icon: typeof Lock; label: string }>) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-medium text-[#5f6b73] shadow-[0_10px_25px_rgba(34,48,58,0.05)] backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-[#335c67]" />
      {label}
    </div>
  );
}

export default function Storybook4Page() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-[#f5f1eb] text-[#22303a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,242,214,0.85),transparent_28%),radial-gradient(circle_at_22%_24%,rgba(220,230,234,0.85),transparent_18%),radial-gradient(circle_at_78%_20%,rgba(234,231,225,0.9),transparent_20%),linear-gradient(180deg,#f8f4ef_0%,#f5f1eb_48%,#f7f3ed_100%)]" />
        <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-[#f6d88f]/75 blur-[10px]" />
        <div className="absolute left-[12%] top-28 h-28 w-56 rounded-full bg-[#eae7e1]/95 blur-[2px]" />
        <div className="absolute right-[10%] top-24 h-32 w-72 rounded-full bg-[#dce6ea]/95 blur-[2px]" />
        <div className="absolute left-1/2 top-36 h-24 w-80 -translate-x-1/2 rounded-full bg-[#f5f1eb]/90 blur-[2px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
          <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-[0_14px_30px_rgba(34,48,58,0.08)]">
                <Sun className="h-5 w-5 text-[#335c67]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#5f6b73]">JuPhD Care</p>
                <p className="text-sm font-semibold">Proposta principal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/storybook3" className="text-sm text-[#5f6b73] underline decoration-[#d7d0c8] underline-offset-4">Wireframe</a>
              <button className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-[#5f6b73] shadow-[0_10px_25px_rgba(34,48,58,0.05)]">
                <LogOut className="mr-2 inline h-4 w-4" /> Sair
              </button>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div className="space-y-6">
              <Badge className="border-[#d7d0c8] bg-white/75 px-4 py-1.5 text-[#5f6b73] shadow-[0_10px_25px_rgba(34,48,58,0.05)]">Entre Nuvens, Há Cuidado</Badge>
              <div className="space-y-4">
                <h1 className="max-w-xl text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
                  Como você está <span className="text-[#335c67]">hoje</span>?
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-[#5f6b73]">
                  Seu check-in leva poucos minutos e nos ajuda a cuidar melhor de você, com confidencialidade e atenção.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <TrustPill icon={Lock} label="Confidencial" />
                <TrustPill icon={TimerReset} label="Poucos minutos" />
                <TrustPill icon={HeartHandshake} label="Apoio quando necessário" />
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-[38px] border border-white/60 bg-white/55 shadow-[0_30px_80px_rgba(34,48,58,0.08)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,242,214,0.95),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.3),rgba(245,241,235,0.15))]" />
              <div className="absolute left-1/2 top-12 h-40 w-40 -translate-x-1/2 rounded-full bg-[#f6d88f]/90 shadow-[0_0_80px_rgba(246,216,143,0.55)]" />
              <div className="absolute left-10 top-32 h-24 w-44 rounded-full bg-[#eae7e1]/95 shadow-[0_20px_30px_rgba(34,48,58,0.04)]" />
              <div className="absolute right-8 top-28 h-28 w-56 rounded-full bg-[#dce6ea]/95 shadow-[0_20px_30px_rgba(34,48,58,0.05)]" />
              <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#5f6b73]">
                <Cloud className="h-3.5 w-3.5 text-[#335c67]" />
                Estado neutro equilibrado
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[34px] border border-[#e4ddd6] bg-[#fcfaf7] p-6 shadow-[0_24px_60px_rgba(34,48,58,0.06)] md:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5f6b73]">Check-in de hoje</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">Reserve alguns minutos para registrar como você está.</h2>
                </div>
                <Badge className="border-[#d7d0c8] bg-[#f7f3ed] text-[#5f6b73]">Leva cerca de 3 minutos</Badge>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#5f6b73]">
                Suas respostas nos ajudam a acompanhar seu bem-estar com mais cuidado. Nenhuma informação individual é compartilhada fora do contexto adequado.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button className="h-12 rounded-full bg-[#335c67] px-7 text-sm font-semibold text-[#f9f7f3] hover:bg-[#284b55]">
                  Fazer check-in <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-[#5f6b73]">
                  <CheckCircle2 className="h-4 w-4 text-[#597a68]" />
                  Ainda não realizado hoje
                </div>
              </div>
            </section>

            <section className="rounded-[34px] border border-[#e5d6d4] bg-[#f6ecea] p-6 shadow-[0_24px_60px_rgba(34,48,58,0.05)] md:p-7">
              <div className="mb-4 flex items-center gap-2 text-[#8a5a5a]">
                <Shield className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.18em]">Cuidado e proteção</p>
              </div>
              <h2 className="text-2xl font-semibold leading-tight">Precisa relatar uma situação séria?</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6f5b5b]">
                Se estiver vivendo assédio, violência, ameaça ou outra situação sensível, este canal é confidencial e tratado com cuidado.
              </p>
              <Button variant="outline" className="mt-6 h-12 rounded-full border-[#caaead] bg-white/70 px-6 text-sm font-semibold text-[#8a5a5a] hover:bg-white">
                Acessar canal de proteção
              </Button>
            </section>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[30px] border border-[#e4ddd6] bg-white/72 p-6 shadow-[0_22px_50px_rgba(34,48,58,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5f6b73]">Continuidade</p>
                  <h3 className="mt-1 text-lg font-semibold">Último check-in</h3>
                </div>
                <Sparkles className="h-4 w-4 text-[#335c67]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-[#e8e1d9] bg-[#fcfaf7] p-4">
                  <p className="text-xs text-[#5f6b73]">Humor</p>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e4ddd6] bg-white shadow-[0_10px_24px_rgba(34,48,58,0.05)]">
                    <TbMoodSmile className="h-5 w-5 text-[#335c67]" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Estável</p>
                </div>
                <div className="rounded-[22px] border border-[#e8e1d9] bg-[#fcfaf7] p-4">
                  <p className="text-xs text-[#5f6b73]">Energia</p>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e4ddd6] bg-white shadow-[0_10px_24px_rgba(34,48,58,0.05)]">
                    <TbSunHigh className="h-5 w-5 text-[#f0b84d]" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Disposta</p>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#e4ddd6] bg-[#fcfaf7] p-6 shadow-[0_22px_50px_rgba(34,48,58,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5f6b73]">Racional</p>
                  <h3 className="mt-1 text-lg font-semibold">Por que esta home funciona</h3>
                </div>
                <Badge className="border-[#d7d0c8] bg-[#f7f3ed] text-[#5f6b73]">Dawn Mist</Badge>
              </div>
              <div className="grid gap-3 text-sm leading-relaxed text-[#5f6b73] md:grid-cols-2">
                <p>O hero recebe com clima emocional, não com ruído analítico.</p>
                <p>O check-in domina a hierarquia e vira a ação inevitável da tela.</p>
                <p>A proteção mantém peso institucional sem recorrer a vermelho agressivo.</p>
                <p>Os sinais de confiança são discretos, suficientes e corporativos.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}