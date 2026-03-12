/**
 * ConstancyDots — last 10 days of check-in constancy as mini icons.
 * Sun = checked in, Cloud = missed.
 */

import { motion } from "framer-motion";
import { Sun, Cloud } from "lucide-react";
import { getConstancyDays, type ConstancyDay } from "@/lib/points-ledger";

interface ConstancyDotsProps {
  days?: number;
  className?: string;
}

export default function ConstancyDots({
  days = 10,
  className = "",
}: ConstancyDotsProps) {
  const constancy = getConstancyDays(days);
  // Reverse to show oldest → newest (left to right)
  const ordered = [...constancy].reverse();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {ordered.map((day, i) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          title={`${day.date} — ${day.active ? "Check-in feito" : "Sem check-in"}`}
          className="flex items-center justify-center"
        >
          {day.active ? (
            <Sun className="w-4 h-4 text-brand-gold" />
          ) : (
            <Cloud className="w-4 h-4 text-muted-foreground/40" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
