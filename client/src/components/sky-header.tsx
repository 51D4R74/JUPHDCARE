import { useId } from "react";
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
  teal: "hsl(var(--brand-teal))",
  textSecondary: "hsl(var(--text-body))",
  border: "hsl(var(--border-soft))",
} as const;

const SKY_CONFIG: Record<SkyState, {
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  sunColor: string;
  haloOpacity: number;
  cloudOpacity: number;
  label: string;
}> = {
  clear: {
    bgFrom: "#FEFBF0",
    bgMid: "#FAF4E4",
    bgTo: "#F0EDE6",
    sunColor: "#F5C542",
    haloOpacity: 0.45,
    cloudOpacity: 0.3,
    label: "Céu aberto",
  },
  "partly-cloudy": {
    bgFrom: "#EDF1F5",
    bgMid: "#E7ECF2",
    bgTo: "#E4E8EC",
    sunColor: "#F5C542",
    haloOpacity: 0.25,
    cloudOpacity: 0.7,
    label: "Sol entre nuvens",
  },
  "protective-cloud": {
    bgFrom: "#E2E6EB",
    bgMid: "#DCE0E6",
    bgTo: "#D8DDE3",
    sunColor: "#E8C94A",
    haloOpacity: 0.15,
    cloudOpacity: 0.9,
    label: "Nuvem protetora",
  },
  respiro: {
    bgFrom: "#D9DEE4",
    bgMid: "#D2D6DC",
    bgTo: "#CDD3DA",
    sunColor: "#DAB94A",
    haloOpacity: 0.08,
    cloudOpacity: 1.0,
    label: "Modo Respiro",
  },
};

/**
 * Per-state cloud depth tints.
 * back = distant haze, mid = middle layer, fore = nearest cloud.
 * Concrete hex values required — SVG filter chains don't resolve CSS variables.
 */
const CLOUD_TINTS: Record<SkyState, { back: string; mid: string; fore: string }> = {
  clear:              { back: "#C8D8E6", mid: "#D8E6F0", fore: "#E5EEF6" },
  "partly-cloudy":    { back: "#BACED0", mid: "#CADCEA", fore: "#D6E4EE" },
  "protective-cloud": { back: "#B4C6D4", mid: "#C2D0DE", fore: "#CED8E6" },
  respiro:            { back: "#B0C0CE", mid: "#BECCD8", fore: "#C8D4E0" },
};

// ── Halo ring ─────────────────────────────────────────────────────────────

const HALO_COLORS: Record<HaloMetrics["temperature"], string> = {
  cold: "#8BB8D0",
  warm: "#F5C542",
  hot:  "#E8944A",
} as const;

const HALO_STROKE: Record<HaloMetrics["thickness"], number> = {
  1: 1.5, 2: 2.5, 3: 3.5, 4: 4.5, 5: 6,
} as const;

function HaloRingSVG({
  haloMetrics, cx, cy, r, tempoScale,
}: Readonly<{ haloMetrics: HaloMetrics; cx: number; cy: number; r: number; tempoScale: number }>) {
  const opacityAnim = haloMetrics.pulse ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.7 };
  const trans = haloMetrics.pulse
    ? { duration: 2.4 * tempoScale, repeat: Infinity, ease: "easeInOut" as const }
    : {};
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      stroke={HALO_COLORS[haloMetrics.temperature]}
      strokeWidth={HALO_STROKE[haloMetrics.thickness] ?? 2}
      strokeLinecap="round"
      fill="none"
      animate={opacityAnim}
      transition={trans}
    />
  );
}

// ── Cloud circle geometry ─────────────────────────────────────────────────
//
// Each cloud is rendered as a group of overlapping circles fed through an SVG
// feGaussianBlur filter.  At low σ the circles remain distinct; they merge
// organically as σ rises.  The foreground cloud adds a feColorMatrix
// threshold step to sharpen the silhouette, then a final light blur to
// re-soften the cut edge.  This is the same "metaball / liquid blob"
// technique used by award-winning atmospheric UIs (Dribbble weather concepts,
// Mercury Weather, Linear's hero card).

interface CloudCircle { readonly cx: number; readonly cy: number; readonly r: number; }

function CloudCircles({ circles, fill }: Readonly<{ circles: readonly CloudCircle[]; fill: string }>) {
  return (
    <>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={fill} />
      ))}
    </>
  );
}

/**
 * Two cloud layouts keyed by "hero" / "compact".
 *
 * SVG viewBox is always 0 0 360 128.  With preserveAspectRatio="xMidYMid slice"
 * the compact container (h-14 ≈ 56 px) shows the top 56 viewBox units, so
 * compact clouds must live in y ≤ 50.
 */
const CLOUD_LAYOUTS = {
  hero: {
    sunCX: 180, sunCY: 40, sunR: 18,
    back: [
      { cx: 78,  cy: 76, r: 20 }, { cx: 104, cy: 70, r: 17 },
      { cx: 58,  cy: 80, r: 14 }, { cx: 124, cy: 76, r: 14 },
      { cx: 46,  cy: 76, r: 10 },
    ],
    mid: [
      { cx: 258, cy: 62, r: 18 }, { cx: 282, cy: 56, r: 16 },
      { cx: 240, cy: 66, r: 12 }, { cx: 300, cy: 64, r: 13 },
    ],
    fore: [
      { cx: 158, cy: 100, r: 16 }, { cx: 180, cy: 94,  r: 18 },
      { cx: 140, cy: 104, r: 11 }, { cx: 198, cy: 102, r: 13 },
    ],
  },
  compact: {
    sunCX: 180, sunCY: 22, sunR: 10,
    back: [
      { cx: 70,  cy: 31, r: 11 }, { cx: 88,  cy: 26, r: 10 },
      { cx: 56,  cy: 34, r: 8  }, { cx: 104, cy: 31, r: 8  },
    ],
    mid: [
      { cx: 262, cy: 24, r: 10 }, { cx: 280, cy: 19, r: 9 },
      { cx: 247, cy: 28, r: 7  }, { cx: 294, cy: 27, r: 8 },
    ],
    fore: [
      { cx: 156, cy: 42, r: 9 }, { cx: 174, cy: 38, r: 10 },
      { cx: 141, cy: 45, r: 6 }, { cx: 188, cy: 44, r: 7  },
    ],
  },
} as const;

// ── Main component ────────────────────────────────────────────────────────

export default function SkyHeader({
  skyState,
  solarHaloLevel,
  haloMetrics,
  size = "hero",
  className = "",
}: SkyHeaderProps) {
  // React 18 useId — colons replaced so the value is a valid XML id
  const uid = useId().replace(/:/g, "");
  const compact = size === "compact";
  const layout = compact ? CLOUD_LAYOUTS.compact : CLOUD_LAYOUTS.hero;
  const config = SKY_CONFIG[skyState];
  const tints = CLOUD_TINTS[skyState];
  const effectiveHalo = config.haloOpacity * Math.max(solarHaloLevel, 0);
  // Modo Respiro: slow all animations 1.8× for a calmer, breathing feel
  const tempoScale = skyState === "respiro" ? 1.8 : 1;
  const { sunCX, sunCY, sunR } = layout;

  return (
    <div className={`flex ${compact ? "items-center gap-3" : "flex-col items-center gap-3"} ${className}`.trim()}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden border ${compact ? "h-14 w-full rounded-2xl" : "h-32 w-full max-w-sm rounded-[24px]"}`}
        style={{
          borderColor: palette.border,
          background: `linear-gradient(165deg, ${config.bgFrom} 0%, ${config.bgMid} 55%, ${config.bgTo} 100%)`,
          boxShadow: "0 12px 32px rgba(26,39,68,0.06)",
        }}
      >
        {/*
         * Single full-bleed SVG carries every visual element.
         * viewBox 360×128 stays constant; compact containers crop via
         * preserveAspectRatio="xMidYMid slice" (shows top ~56 units).
         */}
        <svg
          viewBox="0 0 360 128"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            {/* Sun: white-hot core → warm gold rim */}
            <radialGradient id={`sg-${uid}`} cx="42%" cy="36%" r="60%">
              <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.88" />
              <stop offset="28%"  stopColor={config.sunColor} />
              <stop offset="100%" stopColor={config.sunColor} stopOpacity="0.85" />
            </radialGradient>

            {/* Wide diffuse corona (σ=22) */}
            <filter id={`fc-${uid}`} x="-110%" y="-110%" width="320%" height="320%">
              <feGaussianBlur stdDeviation="22" />
            </filter>

            {/* Mid glow ring (σ=10) */}
            <filter id={`fg-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="10" />
            </filter>

            {/* Background cloud: pure atmospheric haze (σ=11) */}
            <filter id={`fb-${uid}`} x="-30%" y="-40%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="11" />
            </filter>

            {/* Mid cloud: moderate blur, circles merge softly (σ=7) */}
            <filter id={`fm-${uid}`} x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="7" />
            </filter>

            {/*
             * Foreground cloud: blur → alpha threshold (organic silhouette)
             * → light re-blur (softened edge).
             * feColorMatrix row 3: A_out = 20·A − 8  →  threshold at A > 0.4
             */}
            <filter id={`ff-${uid}`} x="-16%" y="-28%" width="132%" height="156%">
              <feGaussianBlur stdDeviation="4.5" result="b" />
              <feColorMatrix
                in="b" type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
                result="t"
              />
              <feGaussianBlur in="t" stdDeviation="1.2" />
            </filter>
          </defs>

          {/* ── Wide atmospheric corona ── */}
          <motion.ellipse
            cx={sunCX} cy={sunCY}
            rx={sunR * 3.2} ry={sunR * 3.2}
            fill={config.sunColor}
            filter={`url(#fc-${uid})`}
            style={{ opacity: effectiveHalo * 0.48 }}
            animate={{ rx: [sunR * 3.2, sunR * 3.7, sunR * 3.2], ry: [sunR * 3.2, sunR * 3.7, sunR * 3.2] }}
            transition={{ duration: 6.5 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Inner glow ring ── */}
          <motion.ellipse
            cx={sunCX} cy={sunCY}
            rx={sunR * 1.8} ry={sunR * 1.8}
            fill={config.sunColor}
            filter={`url(#fg-${uid})`}
            style={{ opacity: effectiveHalo * 0.62 + 0.1 }}
            animate={{ rx: [sunR * 1.8, sunR * 2.1, sunR * 1.8], ry: [sunR * 1.8, sunR * 2.1, sunR * 1.8] }}
            transition={{ duration: 5 * tempoScale, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          />

          {/* ── Sun disk ── */}
          <motion.ellipse
            cx={sunCX} cy={sunCY}
            rx={sunR} ry={sunR}
            fill={`url(#sg-${uid})`}
            animate={{ rx: [sunR, sunR * 1.022, sunR], ry: [sunR, sunR * 1.022, sunR] }}
            transition={{ duration: 5.4 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Engagement halo ring ── */}
          {haloMetrics ? (
            <HaloRingSVG
              haloMetrics={haloMetrics}
              cx={sunCX} cy={sunCY}
              r={sunR * (compact ? 1.9 : 1.75)}
              tempoScale={tempoScale}
            />
          ) : null}

          {/* ── Background cloud — distant atmospheric haze ── */}
          <motion.g
            filter={`url(#fb-${uid})`}
            style={{ opacity: config.cloudOpacity * 0.44 }}
            animate={{ x: [0, 14, 0], y: [0, 3, 0] }}
            transition={{ duration: 15 * tempoScale, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudCircles circles={layout.back} fill={tints.back} />
          </motion.g>

          {/* ── Mid cloud — soft volume ── */}
          <motion.g
            filter={`url(#fm-${uid})`}
            style={{ opacity: config.cloudOpacity * 0.72 }}
            animate={{ x: [0, -9, 0], y: [0, -2, 0] }}
            transition={{ duration: 10 * tempoScale, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          >
            <CloudCircles circles={layout.mid} fill={tints.mid} />
          </motion.g>

          {/* ── Foreground cloud — organic silhouette ── */}
          <motion.g
            filter={`url(#ff-${uid})`}
            style={{ opacity: config.cloudOpacity * 0.88 }}
            animate={{ x: [0, 6, 0], y: [0, 1.5, 0] }}
            transition={{ duration: 8 * tempoScale, repeat: Infinity, ease: "easeInOut", delay: 2.7 }}
          >
            <CloudCircles circles={layout.fore} fill={tints.fore} />
          </motion.g>
        </svg>

        {/* ── State label badge ── */}
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
