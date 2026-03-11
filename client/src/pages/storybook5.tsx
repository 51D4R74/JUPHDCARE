import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbMoodSmile, TbSparkles } from "react-icons/tb";
import { ArrowRight, Cloud, HeartHandshake, Lock, LogOut, Shield, SunMedium, TimerReset } from "lucide-react";

function MetaChip({ icon: Icon, label }: Readonly<{ icon: typeof Lock; label: string }>) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-[#67747c] shadow-[0_8px_24px_rgba(36,49,59,0.05)]">
      <Icon className="h-3.5 w-3.5 text-[#597a68]" />
      {label}
    </div>
  );
}

export default function Storybook5Page() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-[#faf6f0] text-[#24313b]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(244,221,214,0.8),transparent_20%),radial-gradient(circle_at_78%_12%,rgba(217,232,242,0.8),transparent_22%),linear-gradient(180deg,#fffaf4_0%,#faf6f0_55%,#f6f1e9_100%)]" />
        <div className="absolute left-[58%] top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-[#f5c96a]/80 blur-[6px]" />
        <div className="absolute left-[16%] top-32 h-24 w-52 rounded-full bg-[#eee7de]/95" />
        <div className="absolute right-[14%] top-28 h-28 w-64 rounded-full bg-[#d9e8f2]/92" />
        <div className="absolute left-[48%] top-44 h-20 w-72 -translate-x-1/2 rounded-full bg-white/85" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10 md:pb-24">
          <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-[0_14px_30px_rgba(36,49,59,0.06)]">
                <SunMedium className="h-5 w-5 text-[#597a68]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#67747c]">JuPhD Care</p>
                <p className="text-sm font-semibold">Variação 2 · Quiet Sunrise</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/storybook4" className="text-sm text-[#67747c] underline decoration-[#e8ded2] underline-offset-4">Proposta principal</a>
              <button className="rounded-full bg-white px-4 py-2 text-sm text-[#67747c] shadow-[0_8px_24px_rgba(36,49,59,0.05)]">
                <LogOut className="mr-2 inline h-4 w-4" /> Sair
              </button>
            </div>
          </header>

          <section className="grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:items-end">
            <div className="rounded-[34px] bg-white/80 p-6 shadow-[0_24px_60px_rgba(36,49,59,0.06)] backdrop-blur-sm md:p-8">
              <Badge className="bg-[#f4edf1] px-4 py-1.5 text-[#7a5a6e]">Variação mais aberta e luminosa</Badge>
              <div className="mt-5 space-y-4">
                <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                  Há espaço para cuidar de você <span className="text-[#597a68]">hoje</span>.
                </h1>
                <p className="max-w-lg text-lg leading-relaxed text-[#67747c]">
                  Comece com um check-in breve. Se algo estiver exigindo mais cuidado, você também encontra apoio aqui.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <MetaChip icon={Lock} label="Confidencial" />
                <MetaChip icon={TimerReset} label="Leitura rápida" />
                <MetaChip icon={HeartHandshake} label="Acolhimento direto" />
              </div>
            </div>

            <div className="relative h-[330px] overflow-hidden rounded-[42px] border border-white/70 bg-white/45 shadow-[0_28px_70px_rgba(36,49,59,0.06)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.02))]" />
              <div className="absolute left-[54%] top-14 h-40 w-40 -translate-x-1/2 rounded-full bg-[#f5c96a]/90 shadow-[0_0_90px_rgba(245,201,106,0.4)]" />
              <div className="absolute left-8 top-24 h-24 w-44 rounded-full bg-[#eee7de]/92" />
              <div className="absolute right-4 top-26 h-28 w-56 rounded-full bg-[#d9e8f2]/92" />
              <div className="absolute bottom-8 left-8 right-8 rounded-[30px] bg-white/70 p-5 shadow-[0_14px_30px_rgba(36,49,59,0.05)]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#67747c]">
                  <Cloud className="h-3.5 w-3.5 text-[#597a68]" />
                  Hero mais otimista e mais aberto
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#67747c]">
                  Aqui o céu ocupa mais espaço e a luz prevalece mais cedo. A sensação é de acolhimento imediato e menos densidade institucional.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-[34px] bg-white p-7 shadow-[0_24px_60px_rgba(36,49,59,0.05)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#67747c]">Check-in</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">Comece por um check-in breve e confidencial.</h2>
                </div>
                <Badge className="bg-[#eef6f0] text-[#597a68]">3 min</Badge>
              </div>
              <p className="text-sm leading-relaxed text-[#67747c]">
                Esta variação trabalha mais leveza. O card é claro, respirável e quase editorial, com menos sensação de sistema e mais sensação de recepção.
              </p>
              <Button className="mt-6 h-12 rounded-full bg-[#597a68] px-7 text-sm font-semibold text-white hover:bg-[#486454]">
                Fazer check-in <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-[34px] bg-[#f4edf1] p-7 shadow-[0_24px_60px_rgba(36,49,59,0.04)]">
              <div className="mb-5 flex items-center gap-2 text-[#7a5a6e]">
                <Shield className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.18em]">Proteção</p>
              </div>
              <h2 className="text-2xl font-semibold leading-tight">Se algo exigir mais cuidado, o canal está aqui.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#6d6270]">
                A energia é um pouco mais suave do que na proposta principal. Ainda institucional, mas com menos peso visual e uma leitura mais gentil.
              </p>
              <Button variant="outline" className="mt-6 h-12 rounded-full border-[#d7c4cf] bg-white/75 px-6 text-sm font-semibold text-[#7a5a6e] hover:bg-white">
                Acessar canal de proteção
              </Button>
            </div>
          </section>

          <section className="mt-5 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[30px] bg-white/90 p-6 shadow-[0_22px_50px_rgba(36,49,59,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#67747c]">Continuidade</p>
                  <h3 className="mt-1 text-lg font-semibold">Módulo leve de continuidade</h3>
                </div>
                <TbSparkles className="h-4 w-4 text-[#597a68]" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] bg-[#faf6f0] p-4">
                  <p className="text-xs text-[#67747c]">Humor</p>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ece4d8] bg-white/85 shadow-[0_10px_24px_rgba(36,49,59,0.05)]">
                    <TbMoodSmile className="h-5 w-5 text-[#597a68]" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Calmo</p>
                </div>
                <div className="rounded-[24px] bg-[#faf6f0] p-4">
                  <p className="text-xs text-[#67747c]">Energia</p>
                  <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ece4d8] bg-white/85 shadow-[0_10px_24px_rgba(36,49,59,0.05)]">
                    <TbSparkles className="h-5 w-5 text-[#597a68]" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Média</p>
                </div>
                <div className="rounded-[24px] bg-[#faf6f0] p-4">
                  <p className="text-xs text-[#67747c]">Hoje</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#67747c]">Uma tela mais luminosa, menos institucional, mais imediatamente acolhedora.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] bg-white/90 p-6 shadow-[0_22px_50px_rgba(36,49,59,0.05)]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#67747c]">Diferença</p>
                <h3 className="mt-1 text-lg font-semibold">Onde esta variação muda</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#67747c]">
                <p>Mais luz e mais ar na composição.</p>
                <p>CTA em sálvia profunda em vez de petróleo.</p>
                <p>Proteção com ameixa suave em vez de vinho terroso.</p>
                <p>Menos gravidade institucional, mais acolhimento imediato.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}