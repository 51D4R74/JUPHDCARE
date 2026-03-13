import { useId } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AnimatedBrandLogoProps = Readonly<{
  size?: "compact" | "hero";
  showWordmark?: boolean;
  className?: string;
}>;

type IdProp = Readonly<{ id: string }>;

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const palette = {
  text: "hsl(var(--text-heading))",
  textSecondary: "hsl(var(--text-body))",
} as const;

/* ------------------------------------------------------------------ */
/*  Sun geometry & ray data                                            */
/* ------------------------------------------------------------------ */

const SUN_CX = 102;
const SUN_CY = 72;
const SUN_R = 28;

/** [angleDeg from 12-o'clock CW, length beyond sun surface] */
const RAY_DEFS: ReadonlyArray<readonly [number, number]> = [
  [-78, 14], [-58, 22], [-38, 30], [-18, 20],
  [4, 32], [24, 22], [44, 28], [64, 18], [82, 12],
];

function buildRayPath(angleDeg: number, length: number): string {
  const R = Math.PI / 180;
  const a = angleDeg * R;
  const hw = 2.8 * R; // half-width at sun surface
  const sin = Math.sin;
  const cos = Math.cos;
  const x1 = SUN_CX + SUN_R * sin(a - hw);
  const y1 = SUN_CY - SUN_R * cos(a - hw);
  const x2 = SUN_CX + SUN_R * sin(a + hw);
  const y2 = SUN_CY - SUN_R * cos(a + hw);
  const tip = SUN_R + length;
  const tx = SUN_CX + tip * sin(a);
  const ty = SUN_CY - tip * cos(a);
  return (
    "M" + x1.toFixed(1) + "," + y1.toFixed(1) +
    " L" + tx.toFixed(1) + "," + ty.toFixed(1) +
    " L" + x2.toFixed(1) + "," + y2.toFixed(1) + "Z"
  );
}

const RAY_PATHS = RAY_DEFS.map(([a, l]) => buildRayPath(a, l));

/* ------------------------------------------------------------------ */
/*  Star data                                                          */
/* ------------------------------------------------------------------ */

/** [cx, cy, size, isFourPointed] */
const STAR_DEFS: ReadonlyArray<readonly [number, number, number, boolean]> = [
  [30, 28, 2.5, true],  [58, 22, 1.2, false], [148, 18, 2, true],
  [172, 32, 1, false], [22, 52, 1.4, false], [168, 52, 2.2, true],
  [42, 42, 0.8, false], [138, 30, 1, false], [178, 68, 1.5, true],
  [18, 78, 1, false], [78, 22, 0.8, false], [118, 18, 1.6, true],
  [158, 48, 0.8, false],[32, 68, 1, false], [62, 48, 1.8, true],
  [128, 22, 0.8, false],[14, 62, 0.8, false], [72, 32, 1.4, true],
  [142, 58, 1.2, false],[90, 16, 1, false], [50, 60, 0.7, false],
  [160, 70, 0.9, false],[112, 25, 0.7, false],
];

function fourPointStarD(cx: number, cy: number, s: number): string {
  const b = s * 0.32;
  return (
    "M" + cx + "," + (cy - s) +
    " L" + (cx + b) + "," + (cy - b) +
    " L" + (cx + s) + "," + cy +
    " L" + (cx + b) + "," + (cy + b) +
    " L" + cx + "," + (cy + s) +
    " L" + (cx - b) + "," + (cy + b) +
    " L" + (cx - s) + "," + cy +
    " L" + (cx - b) + "," + (cy - b) + "Z"
  );
}

/* ------------------------------------------------------------------ */
/*  Wave path (teal cloud-wave)                                        */
/* ------------------------------------------------------------------ */

const WAVE_D = [
  "M -5 128",
  "C 2 122, 12 92, 32 82",
  "C 45 75, 58 76, 72 90",
  "C 88 106, 100 114, 116 108",
  "C 134 100, 152 86, 172 84",
  "C 186 82, 198 92, 212 100",
  "L 212 212 L -5 212 Z",
].join(" ");

/* ------------------------------------------------------------------ */
/*  SVG sub-components (kept outside main to avoid re-mount)           */
/* ------------------------------------------------------------------ */

function SvgDefs({ id }: IdProp) {
  return (
    <defs>
      {/* Gold metallic border */}
      <linearGradient id={id + "-gold"} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A07020" />
        <stop offset="22%" stopColor="#F5D56E" />
        <stop offset="50%" stopColor="#FCEABB" />
        <stop offset="78%" stopColor="#F5D56E" />
        <stop offset="100%" stopColor="#A07020" />
      </linearGradient>

      {/* Dark navy sky */}
      <radialGradient id={id + "-sky"} cx="52%" cy="36%" r="62%">
        <stop offset="0%" stopColor="#1A3058" />
        <stop offset="100%" stopColor="#0A1228" />
      </radialGradient>

      {/* Sun ambient glow */}
      <radialGradient id={id + "-glow"} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(245,200,70,0.50)" />
        <stop offset="60%" stopColor="rgba(245,200,70,0.12)" />
        <stop offset="100%" stopColor="rgba(245,200,70,0)" />
      </radialGradient>

      {/* Sun body */}
      <radialGradient id={id + "-sun"} cx="42%" cy="36%" r="58%">
        <stop offset="0%" stopColor="#FDE98A" />
        <stop offset="50%" stopColor="#F5C542" />
        <stop offset="100%" stopColor="#E09010" />
      </radialGradient>

      {/* Teal wave gradient */}
      <linearGradient id={id + "-wave"} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0C3D4E" />
        <stop offset="28%" stopColor="#1A7080" />
        <stop offset="52%" stopColor="#28A8A0" />
        <stop offset="78%" stopColor="#50D0C0" />
        <stop offset="100%" stopColor="#88E8D8" />
      </linearGradient>

      {/* Clip to inner circle */}
      <clipPath id={id + "-clip"}>
        <circle cx="100" cy="100" r="88" />
      </clipPath>
    </defs>
  );
}

function StarField({ id }: IdProp) {
  return (
    <g>
      {STAR_DEFS.map(([cx, cy, size, isFourPt], i) => {
        const dur = (2.5 + (i % 4) * 0.7).toFixed(1) + "s";
        const delay = ((i * 0.4) % 3).toFixed(1) + "s";

        if (isFourPt) {
          return (
            <path
              key={id + "-s" + String(i)}
              d={fourPointStarD(cx, cy, size)}
              fill="rgba(255,255,255,0.9)"
            >
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
              />
            </path>
          );
        }

        return (
          <circle
            key={id + "-s" + String(i)}
            cx={cx}
            cy={cy}
            r={size * 0.5}
            fill="rgba(255,255,255,0.75)"
          >
            <animate
              attributeName="opacity"
              values="0.25;0.85;0.25"
              dur={dur}
              begin={delay}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </g>
  );
}

function SunWithRays({ id }: IdProp) {
  return (
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Ambient glow */}
      <circle cx={SUN_CX} cy={SUN_CY} r={54} fill={"url(#" + id + "-glow)"} />

      {/* Pointed rays */}
      <g fill="#F5C542" opacity={0.88}>
        {RAY_PATHS.map((d, i) => (
          <path key={"ray-" + String(i)} d={d} />
        ))}
      </g>

      {/* Sun body */}
      <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R} fill={"url(#" + id + "-sun)"} />
    </motion.g>
  );
}

function TealWave({ id }: IdProp) {
  return (
    <motion.path
      d={WAVE_D}
      fill={"url(#" + id + "-wave)"}
      animate={{ x: [0, 2, 0], y: [0, -1.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AnimatedBrandLogo({
  size = "hero",
  showWordmark = true,
  className = "",
}: AnimatedBrandLogoProps) {
  const id = useId().replaceAll(":", "");
  const compact = size === "compact";

  return (
    <div
      className={
        "flex items-center " +
        (compact ? "gap-3" : "flex-col gap-4 text-center") +
        (className ? " " + className : "")
      }
    >
      <motion.svg
        viewBox="0 0 200 200"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={compact ? "h-12 w-12" : "h-28 w-28"}
        style={{ filter: "drop-shadow(0 8px 24px rgba(10,18,40,0.25))" }}
        role="img"
        aria-label="JuPhD Care"
      >
        <SvgDefs id={id} />

        {/* Gold border ring */}
        <circle cx="100" cy="100" r="97" fill={"url(#" + id + "-gold)"} />

        {/* Thin inset line for definition */}
        <circle cx="100" cy="100" r="89" fill="none" stroke="#0A1228" strokeWidth="1.5" />

        {/* Dark navy sky */}
        <circle cx="100" cy="100" r="88" fill={"url(#" + id + "-sky)"} />

        {/* All scene content clipped to inner circle */}
        <g clipPath={"url(#" + id + "-clip)"}>
          <StarField id={id} />
          <SunWithRays id={id} />
          <TealWave id={id} />
        </g>
      </motion.svg>

      {showWordmark ? (
        <div className={compact ? "space-y-0.5" : "space-y-1.5"}>
          <h1
            className={(compact ? "text-base" : "text-3xl") + " font-extrabold tracking-tight"}
            style={{ color: palette.text }}
          >
            JuPhD Care
          </h1>
          <p
            className={(compact ? "text-[10px]" : "text-xs") + " tracking-[0.18em] uppercase font-medium opacity-60"}
            style={{ color: palette.textSecondary }}
          >
            Seu espaço de bem-estar
          </p>
        </div>
      ) : null}
    </div>
  );
}