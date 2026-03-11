import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, LogOut, Shield, Sparkles, Sun } from "lucide-react";

function WireBlock({
  title,
  subtitle,
  children,
  className = "",
}: Readonly<{
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className={`rounded-[28px] border border-dashed border-[#b8beb8] bg-white/75 p-5 shadow-[0_18px_50px_rgba(34,48,58,0.06)] ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a7377]">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-[#6a7377]">{subtitle}</p> : null}
        </div>
        <Badge variant="outline" className="border-[#d7d0c8] bg-[#fcfaf7] text-[#5f6b73]">Wireframe</Badge>
      </div>
      {children}
    </div>
  );
}

export default function Storybook3Page() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-[#f5f1eb] text-[#22303a]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Badge className="border-[#d7d0c8] bg-[#fcfaf7] px-4 py-1.5 text-[#5f6b73]">Storyboard 03 · Wireframe</Badge>
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Wireframe da homepage</h1>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#5f6b73]">
                Estrutura, hierarquia e leitura da tela antes do refinamento visual. O objetivo aqui é validar o ritmo da homepage.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/storybook4">
              <Button className="h-11 rounded-full bg-[#335c67] px-6 text-white hover:bg-[#284b55]">
                Ver Proposta Principal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/storybook5">
              <Button variant="outline" className="h-11 rounded-full border-[#d7d0c8] bg-[#fcfaf7] px-6 text-[#22303a] hover:bg-[#f0ebe4]">
                Ver Variação 2
              </Button>
            </a>
          </div>
        </div>

        <div className="rounded-[36px] border border-[#d7d0c8] bg-[#fcfaf7] p-4 shadow-[0_30px_80px_rgba(34,48,58,0.08)] md:p-6">
          <div className="mx-auto max-w-md overflow-hidden rounded-[30px] border border-[#d7d0c8] bg-[#f7f3ed] shadow-[0_20px_60px_rgba(34,48,58,0.08)]">
            <div className="border-b border-[#e3ddd5] bg-[#fcfaf7] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-dashed border-[#c9d4d9] bg-[#f6efe3] text-[#335c67]">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6a7377]">Header</p>
                    <p className="text-sm font-semibold">Marca + saudação</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-dashed border-[#c9d4d9] px-3 py-2 text-xs text-[#6a7377]">
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <WireBlock title="Hero" subtitle="Símbolo central + headline + subtítulo">
                <div className="rounded-[26px] border border-dashed border-[#d7d0c8] bg-[linear-gradient(180deg,#fbf7f2_0%,#eef2f1_100%)] p-5">
                  <div className="relative mb-5 h-40 overflow-hidden rounded-[22px] border border-dashed border-[#c8d0d1] bg-[#f4efe7]">
                    <div className="absolute left-1/2 top-8 h-24 w-24 -translate-x-1/2 rounded-full border border-dashed border-[#e2c58a] bg-[#f6d88f]/55 blur-[1px]" />
                    <div className="absolute left-8 top-16 h-16 w-32 rounded-full border border-dashed border-[#c8d0d1] bg-[#eae7e1]/80" />
                    <div className="absolute right-6 top-14 h-20 w-40 rounded-full border border-dashed border-[#bcc9cf] bg-[#dce6ea]/80" />
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-dashed border-[#d7d0c8] bg-[#fcfaf7]/85 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#6a7377]">
                      <Cloud className="h-3.5 w-3.5" />
                      Sol entre nuvens
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-48 rounded-full border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                    <div className="h-4 w-full rounded-full border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                    <div className="h-4 w-4/5 rounded-full border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                  </div>
                </div>
              </WireBlock>

              <WireBlock title="Bloco principal" subtitle="Card dominante de check-in">
                <div className="space-y-3 rounded-[24px] border border-dashed border-[#9fb1b6] bg-[#fcfaf7] p-5">
                  <div className="h-3 w-28 rounded-full border border-dashed border-[#d7d0c8] bg-[#f3efe9]" />
                  <div className="h-5 w-3/4 rounded-full border border-dashed border-[#d7d0c8] bg-[#f3efe9]" />
                  <div className="h-4 w-full rounded-full border border-dashed border-[#d7d0c8] bg-[#f3efe9]" />
                  <div className="h-4 w-2/3 rounded-full border border-dashed border-[#d7d0c8] bg-[#f3efe9]" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-3 w-24 rounded-full border border-dashed border-[#d7d0c8] bg-[#f3efe9]" />
                    <div className="rounded-full border border-dashed border-[#335c67] bg-[#335c67]/10 px-4 py-2 text-xs font-semibold text-[#335c67]">
                      CTA principal
                    </div>
                  </div>
                </div>
              </WireBlock>

              <WireBlock title="Bloco secundário" subtitle="Card de cuidado e proteção">
                <div className="space-y-3 rounded-[24px] border border-dashed border-[#c8b0ae] bg-[#f6ecea] p-5">
                  <div className="flex items-center gap-2 text-[#8a5a5a]">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.18em]">Canal sério</span>
                  </div>
                  <div className="h-5 w-2/3 rounded-full border border-dashed border-[#dccbc8] bg-[#fcf7f6]" />
                  <div className="h-4 w-full rounded-full border border-dashed border-[#dccbc8] bg-[#fcf7f6]" />
                  <div className="h-4 w-3/4 rounded-full border border-dashed border-[#dccbc8] bg-[#fcf7f6]" />
                  <div className="pt-2">
                    <div className="inline-flex rounded-full border border-dashed border-[#8a5a5a] px-4 py-2 text-xs font-semibold text-[#8a5a5a]">
                      CTA proteção
                    </div>
                  </div>
                </div>
              </WireBlock>

              <WireBlock title="Linha de confiança" subtitle="3 microprovas de segurança">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Confidencial",
                    "Poucos minutos",
                    "Apoio quando necessário",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-dashed border-[#d7d0c8] bg-[#fcfaf7] px-3 py-3 text-center text-[11px] font-medium leading-tight text-[#5f6b73]">
                      {item}
                    </div>
                  ))}
                </div>
              </WireBlock>

              <WireBlock title="Continuidade" subtitle="Um único módulo abaixo da dobra principal">
                <div className="rounded-[24px] border border-dashed border-[#d7d0c8] bg-[#fcfaf7] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="h-4 w-28 rounded-full border border-dashed border-[#d7d0c8] bg-[#f3efe9]" />
                    <Sparkles className="h-4 w-4 text-[#6a7377]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-dashed border-[#d7d0c8] bg-[#f7f3ed] p-4">
                      <div className="h-3 w-16 rounded-full border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                      <div className="mt-3 h-8 w-8 rounded-2xl border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                    </div>
                    <div className="rounded-2xl border border-dashed border-[#d7d0c8] bg-[#f7f3ed] p-4">
                      <div className="h-3 w-16 rounded-full border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                      <div className="mt-3 h-8 w-8 rounded-2xl border border-dashed border-[#d7d0c8] bg-[#fcfaf7]" />
                    </div>
                  </div>
                </div>
              </WireBlock>
            </div>

            <div className="border-t border-[#e3ddd5] bg-[#fcfaf7] px-5 py-4">
              <div className="grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#6a7377]">
                <div className="rounded-full border border-dashed border-[#d7d0c8] px-2 py-2">Início</div>
                <div className="rounded-full border border-dashed border-[#d7d0c8] px-2 py-2">Check-in</div>
                <div className="rounded-full border border-dashed border-[#d7d0c8] px-2 py-2">Proteção</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}