/**
 * SolarPointsBadge — animated point counter for the dashboard header.
 *
 * Shows today's Solar Points with a scale pop on increment.
 * Reads from the points-ledger persistence layer.
 */

import { motion } from "framer-motion";
import { Sun } from "lucide-react";
import { getTotalPointsToday } from "@/lib/points-ledger";

interface SolarPointsBadgeProps {
  /** Override point value (e.g. if parent already has it). */
  points?: number;
  className?: string;
}

export default function SolarPointsBadge({
  points,
  className = "",
}: SolarPointsBadgeProps) {
  const displayPoints = points ?? getTotalPointsToday();

  return (
    <motion.div
      key={displayPoints}
      initial={{ scale: 0.85, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`inline-flex items-center gap-1.5 bg-brand-gold/15 px-3 py-1.5 rounded-full ${className}`}
    >
      <Sun className="w-4 h-4 text-brand-gold" />
      <span className="text-sm font-bold text-brand-gold-dark tabular-nums">
        {displayPoints}
      </span>
    </motion.div>
  );
}
