import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import type { SkyState } from "@/lib/checkin-data";
import type { HaloMetrics } from "@/lib/solar-points";

type SkyHeaderProps = Readonly<{
  skyState: SkyState;
  solarHaloLevel: number;
  haloMetrics?: HaloMetrics | null;
  size?: "compact" | "hero";
  className?: string;
}>;

const palette = {
  navy: "#1E3A5F",
  gold: "#F5C542",          // raw hex — used in alpha concatenation & hexToRgb
  goldSoft: "#FFF6D9",
  teal: "hsl(var(--brand-teal))",
  cloudA: "hsl(var(--surface-cloud-a))",
  cloudB: "hsl(var(--surface-cloud-b))",
  text: "hsl(var(--text-heading))",
  textSecondary: "hsl(var(--text-body))",
  border: "hsl(var(--border-soft))",
} as const;

const SKY_CONFIG: Record<SkyState, {
  bgFrom: string;
  bgTo: string;
  sunColor: string;
  haloSpread: number;
  haloOpacity: number;
  cloudOpacity: number;
  cloudScale: number;
  label: string;
}> = {
  clear: {
    bgFrom: "#FFF6D9",
    bgTo: "#F0EDE6",
    sunColor: palette.gold,
    haloSpread: 36,
    haloOpacity: 0.45,
    cloudOpacity: 0.3,
    cloudScale: 0.8,
    label: "Céu aberto",
  },
  "partly-cloudy": {
    bgFrom: "#EDF1F5",
    bgTo: "#E4E8EC",
    sunColor: palette.gold,
    haloSpread: 24,
    haloOpacity: 0.25,
    cloudOpacity: 0.7,
    cloudScale: 1,
    label: "Sol entre nuvens",
  },
  "protective-cloud": {
    bgFrom: "#E2E6EB",
    bgTo: "#D8DDE3",
    sunColor: "#E8C94A",
    haloSpread: 14,
    haloOpacity: 0.15,
    cloudOpacity: 0.9,
    cloudScale: 1.15,
    label: "Nuvem protetora",
  },
  respiro: {
    bgFrom: "#D9DEE4",
    bgTo: "#CDD3DA",
    sunColor: "#DAB94A",
    haloSpread: 8,
    haloOpacity: 0.08,
    cloudOpacity: 1,
    cloudScale: 1.25,
    label: "Modo Respiro",
  },
};

const HALO_COLORS: Record<string, string> = {
  cold: "#8BB8D0",   // cool blue
  warm: "#F5C542",   // gold
  hot: "#E8944A",    // warm orange
} as const;

const HALO_STROKE: Record<number, number> = {
  1: 1.5,
  2: 2.5,
  3: 3.5,
  4: 4.5,
  5: 6,
} as const;

export default function SkyHeader({
  skyState,
  solarHaloLevel,
  haloMetrics,
  size = "hero",
  className = "",
}: SkyHeaderProps) {
  const compact = size === "compact";
  const config = SKY_CONFIG[skyState];
  const effectiveHalo = config.haloOpacity * Math.max(solarHaloLevel, 0);
  // Modo Respiro: slow all animations by 1.8× for calmer feel
  const tempoScale = skyState === "respiro" ? 1.8 : 1;

  return (
    <div className={`flex ${compact ? "items-center gap-3" : "flex-col items-center gap-3"} ${className}`.trim()}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden border ${compact ? "h-14 w-full rounded-2xl" : "h-32 w-full max-w-sm rounded-[24px]"}`}
        style={{
          borderColor: palette.border,
          background: `linear-gradient(180deg, ${config.bgFrom}, ${config.bgTo})`,
          boxShadow: "0 12px 32px rgba(26,39,68,0.06)",
        }}
      >
        {/* Radial glow behind sun */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% ${compact ? "50%" : "30%"}, ${config.sunColor}${Math.round(effectiveHalo * 40).toString(16).padStart(2, "0")} 0%, transparent 50%)`,
          }}
        />

        {/* Sun */}
        <motion.div
          animate={{ y: [0, -2, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 4.2 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-1/2 rounded-full ${compact ? "top-2 h-6 w-6" : "top-5 h-12 w-12"}`}
          style={{
            transform: "translateX(-50%)",
            background: `${config.sunColor}E6`,
            boxShadow: `0 0 ${config.haloSpread}px rgba(${hexToRgb(config.sunColor)},${effectiveHalo})`,
          }}
        />

        {/* Solar Halo Ring (engagement indicator) */}
        {haloMetrics ? (
          <motion.svg
            animate={haloMetrics.pulse
              ? { opacity: [0.8, 1, 0.8], scale: [1, 1.04, 1] }
              : { opacity: 1 }}
            transition={haloMetrics.pulse
              ? { duration: 2.4 * tempoScale, repeat: Infinity, ease: "easeInOut" }
              : {}}
            className={`absolute left-1/2 ${compact ? "top-0 h-10 w-10" : "top-2 h-16 w-16"}`}
            style={{ transform: "translateX(-50%)" }}
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r={28}
              stroke={HALO_COLORS[haloMetrics.temperature]}
              strokeWidth={HALO_STROKE[haloMetrics.thickness] ?? 2}
              strokeLinecap="round"
              opacity={0.7}
            />
          </motion.svg>
        ) : null}

        {/* Cloud A — drifts left */}
        <motion.div
          animate={{ x: [0, -4, 0], y: [0, 1, 0], opacity: [config.cloudOpacity, config.cloudOpacity * 0.9, config.cloudOpacity] }}
          transition={{ duration: 5 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full ${compact ? "left-1 top-5 h-4 w-8" : "left-3 top-12 h-8 w-16"}`}
          style={{
            background: palette.cloudA,
            transform: `scale(${config.cloudScale})`,
          }}
        />

        {/* Cloud B — drifts right */}
        <motion.div
          animate={{ x: [0, 5, 0], y: [0, -1, 0], opacity: [config.cloudOpacity, config.cloudOpacity * 0.95, config.cloudOpacity] }}
          transition={{ duration: 5.8 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full ${compact ? "right-1 top-3 h-5 w-10" : "right-2 top-10 h-10 w-20"}`}
          style={{
            background: palette.cloudB,
            transform: `scale(${config.cloudScale})`,
          }}
        />

        {/* Mist layer */}
        <motion.div
          animate={{ opacity: [0.88 * config.cloudOpacity, config.cloudOpacity, 0.88 * config.cloudOpacity] }}
          transition={{ duration: 3.6 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-1/2 rounded-full ${compact ? "top-7 h-3 w-12" : "top-[72px] h-6 w-24"}`}
          style={{
            transform: "translateX(-50%)",
            background: `rgba(243,241,237,${0.7 + config.cloudOpacity * 0.22})`,
          }}
        />

        {/* State label badge */}
        {compact ? null : (
          <div
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(255,255,255,0.72)",
              background: "rgba(255,255,255,0.8)",
              color: palette.textSecondary,
            }}
          >
            <Cloud className="h-3 w-3" style={{ color: palette.teal }} />
            {config.label}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/** Convert hex color to "r,g,b" string for use in rgba(). */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.substring(0, 2), 16);
  const g = Number.parseInt(h.substring(2, 4), 16);
  const b = Number.parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
