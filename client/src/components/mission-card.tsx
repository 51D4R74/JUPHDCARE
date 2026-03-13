import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type MissionStatus = "pending" | "done";

export interface MissionDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: number;
  category: string;
}

type MissionCardProps = Readonly<{
  mission: MissionDef;
  status: MissionStatus;
  onComplete: (missionId: string) => void;
  className?: string;
}>;

export default function MissionCard({
  mission,
  status,
  onComplete,
  className = "",
}: MissionCardProps) {
  const [animating, setAnimating] = useState(false);
  const isDone = status === "done" || animating;

  function handleTap() {
    if (isDone) return;
    setAnimating(true);
    // Short delay for the check animation, then notify parent
    setTimeout(() => onComplete(mission.id), 400);
  }

  const Icon = mission.icon;

  return (
    <Card
      className={`overflow-hidden transition-colors ${isDone ? "opacity-70" : "cursor-pointer hover:border-brand-navy/15"} ${className}`.trim()}
      onClick={handleTap}
      role="button"
      aria-label={isDone ? `${mission.title} — concluída` : `Completar: ${mission.title}`}
      data-testid={`mission-${mission.id}`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        {/* Icon / check circle */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={isDone ? { scale: [1, 1.2, 1], backgroundColor: "hsl(var(--score-good))" } : {}}
            transition={{ duration: 0.3 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDone ? "bg-emerald-500" : "bg-brand-navy/10"
            }`}
          >
            {isDone ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <Icon className="w-5 h-5 text-brand-navy" />
            )}
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`}>
            {mission.title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {mission.description}
          </p>
        </div>

        {/* Points badge */}
        <motion.div
          animate={isDone ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.35, delay: 0.1 }}
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isDone
              ? "bg-emerald-100 text-emerald-700"
              : "bg-brand-gold/15 text-brand-gold-dark"
          }`}
        >
          +{mission.points} ☀️
        </motion.div>
      </CardContent>
    </Card>
  );
}
