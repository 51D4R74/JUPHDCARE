/**
 * RH aggregate card — reusable stat/metric card for the RH dashboard.
 *
 * Supports: plain number, percentage, trend indicator, colored severity.
 */

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface RHAggregateCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { direction: "up" | "down" | "flat"; value: string };
  trendPositive?: "up" | "down"; // which direction is "good"
  className?: string;
  delay?: number;
}

export default function RHAggregateCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  trendPositive = "up",
  className,
  delay = 0,
}: RHAggregateCardProps) {
  const trendColor = (() => {
    if (!trend) return "";
    if (trend.direction === "flat") return "text-muted-foreground";
    const isGood = trend.direction === trendPositive;
    return isGood ? "text-score-good" : "text-score-critical";
  })();

  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl border border-border-soft bg-white p-5 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        {icon}
        {trend && (
          <span className={`text-xs flex items-center gap-0.5 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {subtitle && (
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{subtitle}</p>
      )}
    </motion.div>
  );
}
