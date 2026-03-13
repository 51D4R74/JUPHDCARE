/**
 * SolarPointsBadge — animated point counter for the dashboard header.
 *
 * Shows today's Solar Points with a scale pop on increment.
 * Points are computed by the parent from server data.
 */

import { motion } from "framer-motion";
import { Sun } from "lucide-react";

interface SolarPointsBadgeProps {
  readonly points: number;
  readonly className?: string;
}

export default function SolarPointsBadge({
  points,
  className = "",
}: Readonly<SolarPointsBadgeProps>) {
  return (
    <motion.div
      key={points}
      initial={{ scale: 0.85, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`inline-flex items-center gap-1.5 bg-brand-gold/15 px-3 py-1.5 rounded-full ${className}`}
    >
      <Sun className="w-4 h-4 text-brand-gold" />
      <span className="text-sm font-bold text-brand-gold-dark tabular-nums">
        {points}
      </span>
    </motion.div>
  );
}
