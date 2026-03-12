import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

type AnimatedBrandLogoProps = Readonly<{
  size?: "compact" | "hero";
  showWordmark?: boolean;
  className?: string;
}>;

const palette = {
  navy: "#1E3A5F",
  gold: "#F5C542",          // raw hex — used in alpha concatenation
  goldSoft: "#FFF6D9",
  teal: "hsl(var(--brand-teal))",
  cloudA: "hsl(var(--surface-cloud-a))",
  cloudB: "hsl(var(--surface-cloud-b))",
  text: "hsl(var(--text-heading))",
  textSecondary: "hsl(var(--text-body))",
  border: "hsl(var(--border-soft))",
} as const;

export default function AnimatedBrandLogo({
  size = "hero",
  showWordmark = true,
  className = "",
}: AnimatedBrandLogoProps) {
  const compact = size === "compact";

  return (
    <div className={`flex items-center ${compact ? "gap-3" : "flex-col gap-4 text-center"} ${className}`.trim()}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden border ${compact ? "h-12 w-12 rounded-2xl" : "h-28 w-28 rounded-[28px]"}`}
        style={{
          borderColor: palette.border,
          background: "rgba(255,255,255,0.78)",
          boxShadow: "0 18px 40px rgba(26,39,68,0.08)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 18%, ${palette.goldSoft} 0%, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.82), rgba(243,241,237,0.92))`,
          }}
        />

        <motion.div
          animate={{ y: [0, -3, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-1/2 rounded-full ${compact ? "top-2 h-6 w-6" : "top-5 h-14 w-14"}`}
          style={{
            transform: "translateX(-50%)",
            background: `${palette.gold}E6`,
            boxShadow: "0 0 36px rgba(245,197,66,0.45)",
          }}
        />

        <motion.div
          animate={{ x: [0, -3, 0], y: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full ${compact ? "left-1 top-5 h-4 w-7" : "left-2 top-12 h-8 w-14"}`}
          style={{ background: palette.cloudA }}
        />

        <motion.div
          animate={{ x: [0, 4, 0], y: [0, -1, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full ${compact ? "right-1 top-4 h-5 w-9" : "right-1 top-10 h-10 w-16"}`}
          style={{ background: palette.cloudB }}
        />

        <motion.div
          animate={{ opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-1/2 rounded-full ${compact ? "top-7 h-3 w-10" : "top-16 h-7 w-20"}`}
          style={{
            transform: "translateX(-50%)",
            background: "rgba(243,241,237,0.92)",
          }}
        />

        {!compact ? (
          <div
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(255,255,255,0.72)",
              background: "rgba(255,255,255,0.8)",
              color: palette.textSecondary,
            }}
          >
            <Cloud className="h-3 w-3" style={{ color: palette.teal }} />
            Sol entre nuvens
          </div>
        ) : null}
      </motion.div>

      {showWordmark ? (
        <div className={compact ? "space-y-0.5" : "space-y-1"}>
          <p className={`${compact ? "text-sm" : "text-2xl"} font-bold tracking-tight`} style={{ color: palette.text }}>
            JuPhD Care
          </p>
          <p className={`${compact ? "text-[11px]" : "text-sm"} uppercase tracking-[0.16em]`} style={{ color: palette.textSecondary }}>
            Gestao de Riscos Psicossociais
          </p>
        </div>
      ) : null}
    </div>
  );
}