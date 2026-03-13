/**
 * SolarPointsBadge — animated point counter for the dashboard header.
 *
 * Shows today's Solar Points with a scale pop on increment.
 * Points are computed by the parent from server data.
 * When points are 0 and user hasn't dismissed, shows an explanatory tooltip.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TOOLTIP_DISMISSED_KEY = "juphdcare_solar_tooltip_dismissed";

interface SolarPointsBadgeProps {
  readonly points: number;
  readonly className?: string;
}

export default function SolarPointsBadge({
  points,
  className = "",
}: Readonly<SolarPointsBadgeProps>) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (points > 0) return;
    const dismissed = localStorage.getItem(TOOLTIP_DISMISSED_KEY);
    if (dismissed) return;
    // Show after a short delay so the page settles
    const timer = setTimeout(() => setShowHint(true), 1200);
    return () => clearTimeout(timer);
  }, [points]);

  function handleDismiss() {
    setShowHint(false);
    localStorage.setItem(TOOLTIP_DISMISSED_KEY, "1");
  }

  const badge = (
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

  if (points > 0) return badge;

  return (
    <TooltipProvider>
      <Tooltip open={showHint} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <TooltipTrigger asChild onClick={handleDismiss}>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[220px] text-center text-xs leading-relaxed">
          <p className="font-semibold mb-0.5">Pontos Solares ☀</p>
          <p>Faça seu check-in diário e complete missões para acumular pontos e ver seu halo brilhar.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
