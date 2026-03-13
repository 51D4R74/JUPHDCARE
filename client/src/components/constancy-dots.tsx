/**
 * ConstancyDots — last 10 days of check-in constancy as mini icons.
 * Sun = checked in, Cloud = missed.
 *
 * Derives constancy from `checkedInDates` (server history).
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Cloud } from "lucide-react";

interface ConstancyDotsProps {
  readonly days?: number;
  readonly className?: string;
  /** ISO date strings ("YYYY-MM-DD") from server history. */
  readonly checkedInDates: ReadonlyArray<string>;
}

function deriveConstancy(days: number, checkedInDates: ReadonlyArray<string>) {
  const dateSet = new Set(checkedInDates);
  const now = new Date();
  const result: { date: string; active: boolean }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, active: dateSet.has(key) });
  }
  return result;
}

export default function ConstancyDots({
  days = 10,
  className = "",
  checkedInDates,
}: Readonly<ConstancyDotsProps>) {
  const constancy = useMemo(
    () => deriveConstancy(days, checkedInDates),
    [days, checkedInDates],
  );
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
