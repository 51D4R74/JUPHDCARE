/**
 * Mission engine — adaptive mission selection based on user state.
 *
 * Selects 3–4 missions from a pool, weighted by:
 *   1. User state (stable / tense / respiro)
 *   2. Score domain deficits (recarga low → breathing/pause missions)
 *   3. Time of day (morning vs afternoon mix)
 *   4. Recency bias (avoid repeating yesterday's missions)
 *
 * BACKLOG: calibrate weights with engagement data [post-pilot]
 */

import type { LucideIcon } from "lucide-react";
import {
  Wind, Droplets, Timer, Heart, Eye, Flower2,
  MessageCircleHeart, HandHeart, SunMedium, PenLine,
  Music, Footprints, Coffee, BookOpen, Smile,
} from "lucide-react";
import type { SkyState, ScoreDomainId } from "@/lib/checkin-data";

// ── Types ─────────────────────────────────────────

export type MissionCategory =
  | "breathing"
  | "hydration"
  | "pause"
  | "gratitude"
  | "focus"
  | "connection"
  | "boundary"
  | "closure"
  | "movement"
  | "sensory";

export type MissionDifficulty = "simple" | "medium" | "support";

export interface MissionTemplate {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  points: number;
  /** Which user states favor this mission — empty means all states */
  preferredStates: SkyState[];
  /** Which deficit domain this mission addresses — null = general */
  targetDomain: ScoreDomainId | null;
  /** Time window preference — null = anytime */
  timeWindow: "morning" | "afternoon" | null;
}

export interface SelectedMission {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: number;
  category: string;
}

// ── Mission pool ──────────────────────────────────
// 30+ missions across categories as specified in M1 milestone.

const MISSION_POOL: MissionTemplate[] = [
  // Breathing
  {
    id: "breathing-box",
    title: "Respiração quadrada",
    description: "Inspire 4s, segure 4s, expire 4s, segure 4s. Repita 4 vezes.",
    icon: Wind,
    category: "breathing",
    difficulty: "simple",
    points: 5,
    preferredStates: ["partly-cloudy", "protective-cloud", "respiro"],
    targetDomain: "recarga",
    timeWindow: null,
  },
  {
    id: "breathing-calm",
    title: "Respiração calmante",
    description: "Inspire pelo nariz contando até 3, expire pela boca contando até 6.",
    icon: Wind,
    category: "breathing",
    difficulty: "simple",
    points: 5,
    preferredStates: ["protective-cloud", "respiro"],
    targetDomain: "recarga",
    timeWindow: null,
  },
  {
    id: "breathing-morning",
    title: "3 respirações ao despertar",
    description: "Antes de olhar o celular: 3 inspirações profundas pelo nariz.",
    icon: Wind,
    category: "breathing",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "recarga",
    timeWindow: "morning",
  },

  // Hydration
  {
    id: "hydration-1",
    title: "Beba um copo de água",
    description: "Hidratação melhora foco e energia. Beba agora.",
    icon: Droplets,
    category: "hydration",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "recarga",
    timeWindow: null,
  },
  {
    id: "hydration-2",
    title: "Mais um copo de água",
    description: "Já bebeu água na última hora? Seu corpo agradece.",
    icon: Droplets,
    category: "hydration",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "recarga",
    timeWindow: "afternoon",
  },

  // Pause
  {
    id: "pause-2min",
    title: "Pausa de 2 minutos",
    description: "Levante, olhe pela janela, respire. Nem precisa pensar em nada.",
    icon: Timer,
    category: "pause",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "recarga",
    timeWindow: null,
  },
  {
    id: "pause-screen",
    title: "5 min sem tela",
    description: "Feche o notebook, guarde o celular. Só 5 minutinhos.",
    icon: Eye,
    category: "pause",
    difficulty: "medium",
    points: 8,
    preferredStates: ["partly-cloudy", "protective-cloud"],
    targetDomain: "estado-do-dia",
    timeWindow: "afternoon",
  },
  {
    id: "pause-coffee",
    title: "Café ou chá consciente",
    description: "Prepare uma bebida quente. Beba sem pressa, sem multitarefa.",
    icon: Coffee,
    category: "pause",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: null,
    timeWindow: "morning",
  },

  // Gratitude
  {
    id: "gratitude-note",
    title: "Anote uma coisa boa de hoje",
    description: "Gratidão reduz estresse percebido. Uma frase basta.",
    icon: Heart,
    category: "gratitude",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "estado-do-dia",
    timeWindow: null,
  },
  {
    id: "gratitude-person",
    title: "Agradeça alguém do trabalho",
    description: "Uma mensagem rápida reconhecendo algo que alguém fez.",
    icon: MessageCircleHeart,
    category: "gratitude",
    difficulty: "support",
    points: 6,
    preferredStates: ["clear", "partly-cloudy"],
    targetDomain: "seguranca-relacional",
    timeWindow: null,
  },

  // Connection
  {
    id: "connection-check",
    title: "Pergunte como alguém está",
    description: "Escolha um colega e pergunte como foi o dia. De verdade.",
    icon: HandHeart,
    category: "connection",
    difficulty: "support",
    points: 6,
    preferredStates: ["clear", "partly-cloudy"],
    targetDomain: "seguranca-relacional",
    timeWindow: null,
  },
  {
    id: "connection-smile",
    title: "Sorria para alguém",
    description: "Um sorriso genuíno muda o clima. Pode ser virtual também. 😊",
    icon: Smile,
    category: "connection",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "seguranca-relacional",
    timeWindow: null,
  },

  // Movement
  {
    id: "movement-stretch",
    title: "Alongamento de 2 min",
    description: "Pescoço, ombros, punhos. Quem trabalha sentado precisa disso.",
    icon: Flower2,
    category: "movement",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "recarga",
    timeWindow: null,
  },
  {
    id: "movement-walk",
    title: "Caminhada de 5 min",
    description: "Nem precisa ser longe. Dê uma volta no andar, pelo corredor.",
    icon: Footprints,
    category: "movement",
    difficulty: "medium",
    points: 8,
    preferredStates: ["partly-cloudy", "protective-cloud"],
    targetDomain: "recarga",
    timeWindow: "afternoon",
  },

  // Sensory
  {
    id: "sensory-music",
    title: "Ouça uma música que acalma",
    description: "Coloque fone, feche os olhos se puder. Uma música só.",
    icon: Music,
    category: "sensory",
    difficulty: "simple",
    points: 5,
    preferredStates: ["protective-cloud", "respiro"],
    targetDomain: "estado-do-dia",
    timeWindow: null,
  },
  {
    id: "sensory-sunlight",
    title: "Busque luz natural",
    description: "Vá até uma janela ou saída. 2 min de luz solar ajustam seu ritmo.",
    icon: SunMedium,
    category: "sensory",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "recarga",
    timeWindow: "morning",
  },

  // Focus
  {
    id: "focus-5min",
    title: "Bloco de foco de 5 min",
    description: "Escolha uma tarefa. Sem interrupções por 5 minutos. Só isso.",
    icon: BookOpen,
    category: "focus",
    difficulty: "medium",
    points: 8,
    preferredStates: ["clear", "partly-cloudy"],
    targetDomain: "estado-do-dia",
    timeWindow: null,
  },

  // Boundary
  {
    id: "boundary-one",
    title: "Defina um limite hoje",
    description: "Diga 'agora não' a uma demanda. Um limite claro por dia.",
    icon: HandHeart,
    category: "boundary",
    difficulty: "medium",
    points: 8,
    preferredStates: ["protective-cloud", "respiro"],
    targetDomain: "seguranca-relacional",
    timeWindow: null,
  },

  // Closure
  {
    id: "closure-day",
    title: "Feche o dia em 20 segundos",
    description: "Anote: O que fiz? O que ficou? Como me sinto saindo?",
    icon: PenLine,
    category: "closure",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "estado-do-dia",
    timeWindow: "afternoon",
  },
  {
    id: "closure-positive",
    title: "Termine com algo positivo",
    description: "Antes de sair: relembre uma interação boa do dia.",
    icon: SunMedium,
    category: "closure",
    difficulty: "simple",
    points: 5,
    preferredStates: [],
    targetDomain: "estado-do-dia",
    timeWindow: "afternoon",
  },
];

// ── Scoring rules ─────────────────────────────────
// Canonical POINT_VALUES lives in shared/constants.ts.
// Re-export for backward compatibility with consumers that import from here.
export { POINT_VALUES } from "@shared/constants";

// ── Selection engine ──────────────────────────────

interface SelectionContext {
  skyState: SkyState;
  domainScores: Record<ScoreDomainId, number>;
  flags: string[];
  recentMissionIds: string[]; // missions completed in last 2 days
}

/** Deterministic seed from date — ensures same user gets same missions per day. */
function dayseed(): number {
  const dateStr = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = Math.trunc((hash << 5) - hash + (dateStr.codePointAt(i) ?? 0));
  }
  return Math.abs(hash);
}

/** Seeded pseudo-random (mulberry32). */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.trunc(s);
    s = Math.trunc(s + 0x6d2b79f5);
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Difficulty weight multiplier when user is in respiro (recovery) mode. */
function respiroFactor(difficulty: MissionTemplate["difficulty"]): number {
  if (difficulty === "medium") return 0.4;
  if (difficulty === "support") return 0.2;
  return 1;
}

/** Compute selection weight for a mission given the user's context. */
function computeWeight(mission: MissionTemplate, ctx: SelectionContext): number {
  let weight = 1;

  // State match bonus
  if (mission.preferredStates.length === 0) {
    weight += 0.5; // universal missions get mild bonus
  } else if (mission.preferredStates.includes(ctx.skyState)) {
    weight += 2; // strong match
  } else {
    weight *= 0.3; // weak match
  }

  // Domain deficit targeting
  if (mission.targetDomain) {
    const score = ctx.domainScores[mission.targetDomain] ?? 50;
    if (score < 40) weight += 1.5; // significant deficit → strong push
    else if (score < 60) weight += 0.5;
  }

  // Time window
  const hour = new Date().getHours();
  if (mission.timeWindow === "morning" && hour >= 14) weight *= 0.2;
  if (mission.timeWindow === "afternoon" && hour < 11) weight *= 0.2;

  // Recency penalty (cooldown — avoid repeating yesterday's missions)
  if (ctx.recentMissionIds.includes(mission.id)) {
    weight *= 0.15;
  }

  // Respiro mode: de-prioritize demanding missions
  if (ctx.skyState === "respiro") {
    weight *= respiroFactor(mission.difficulty);
  }

  return Math.max(weight, 0.01);
}

/**
 * Select today's missions (3–4) based on user state. Deterministic per day
 * so the same user sees the same set on repeated visits.
 */
export function selectMissions(ctx: SelectionContext): SelectedMission[] {
  const rand = seededRandom(dayHash(ctx));
  const count = ctx.skyState === "respiro" ? 2 : 4;

  // Weight each mission
  const weighted = MISSION_POOL.map((m) => ({
    mission: m,
    weight: computeWeight(m, ctx),
  }));

  const selected: MissionTemplate[] = [];
  const usedCategories = new Set<MissionCategory>();

  for (let pick = 0; pick < count; pick++) {
    const available = weighted.filter(
      (w) =>
        !selected.includes(w.mission) &&
        // Ensure category diversity: first N picks must be unique categories
        (pick >= 3 || !usedCategories.has(w.mission.category)),
    );

    if (available.length === 0) break;

    const totalWeight = available.reduce((s, w) => s + w.weight, 0);
    let roll = rand() * totalWeight;

    let chosen = available[0].mission;
    for (const w of available) {
      roll -= w.weight;
      if (roll <= 0) {
        chosen = w.mission;
        break;
      }
    }

    selected.push(chosen);
    usedCategories.add(chosen.category);
  }

  return selected.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    icon: m.icon,
    points: m.points,
    category: m.category,
  }));
}

function skyStateToInt(skyState: string): number {
  if (skyState === "clear") return 1;
  if (skyState === "partly-cloudy") return 2;
  if (skyState === "protective-cloud") return 3;
  return 4;
}

/** Extended day seed that incorporates context for variety across users. */
function dayHash(ctx: SelectionContext): number {
  const base = dayseed();
  // Mix in sky state to vary missions when user state changes mid-day
  const stateVal = skyStateToInt(ctx.skyState);
  return base ^ (stateVal * 7919);
}

/** Get the full pool size (for testing/debugging). */
export function getMissionPoolSize(): number {
  return MISSION_POOL.length;
}
