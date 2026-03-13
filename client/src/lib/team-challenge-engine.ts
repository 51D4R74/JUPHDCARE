/**
 * Team challenge engine — client-side stub for collective missions.
 *
 * Stores team challenge progress in localStorage.
 * Individual contributions are private — only aggregate total is visible.
 * Per-person daily cap prevents gaming.
 *
 * BACKLOG: replace localStorage stub with API integration when backend ready [future milestone]
 *   Server endpoints: GET /api/team-challenges/:teamId/current
 *                     POST /api/team-challenges/:id/contribute
 */

// ── Types ─────────────────────────────────────────

export type ChallengeCategory =
  | "hydration"
  | "pause"
  | "support"
  | "checkin"
  | "breathing";

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  category: ChallengeCategory;
  target: number;
  unit: string;
  capPerPersonPerDay: number;
}

export interface TeamChallengeState {
  challengeId: string;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  progress: number;
  contributions: ContributionRecord[];
}

export interface ContributionRecord {
  date: string; // ISO date
  amount: number;
  type: string; // challengeId
}

export interface MilestoneThreshold {
  pct: number;
  label: string;
  reached: boolean;
}

// ── Challenge pool ────────────────────────────────

export const CHALLENGE_POOL: ChallengeTemplate[] = [
  {
    id: "collective-water",
    title: "Copos d'água coletivos",
    description: "Juntos, vamos beber 200 copos de água este mês!",
    icon: "Droplets",
    category: "hydration",
    target: 200,
    unit: "copos",
    capPerPersonPerDay: 3,
  },
  {
    id: "collective-pause",
    title: "Pausas conscientes",
    description: "120 pausas conscientes em equipe para renovar a energia.",
    icon: "PauseCircle",
    category: "pause",
    target: 120,
    unit: "pausas",
    capPerPersonPerDay: 2,
  },
  {
    id: "collective-support",
    title: "Mensagens de apoio",
    description: "80 mensagens de apoio entre colegas. Palavras que curam.",
    icon: "Heart",
    category: "support",
    target: 80,
    unit: "mensagens",
    capPerPersonPerDay: 1,
  },
  {
    id: "collective-checkin",
    title: "Check-ins fechados",
    description: "150 check-ins completos mostram compromisso com o bem-estar.",
    icon: "ClipboardCheck",
    category: "checkin",
    target: 150,
    unit: "check-ins",
    capPerPersonPerDay: 1,
  },
  {
    id: "collective-breathing",
    title: "Minutos de respiração",
    description: "60 minutos coletivos de respiração consciente.",
    icon: "Wind",
    category: "breathing",
    target: 60,
    unit: "minutos",
    capPerPersonPerDay: 3,
  },
];

// ── Storage ───────────────────────────────────────

const STORAGE_KEY = "juphdcare_team_challenge";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): TeamChallengeState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TeamChallengeState) : null;
  } catch (e: unknown) {
    console.warn("Failed to read challenge state:", e);
    return null;
  }
}

function writeState(state: TeamChallengeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Deterministic monthly challenge selection ─────

function getMonthSeed(): number {
  const now = new Date();
  return now.getFullYear() * 100 + now.getMonth();
}

function selectMonthlyChallenge(): ChallengeTemplate {
  const seed = getMonthSeed();
  return CHALLENGE_POOL[seed % CHALLENGE_POOL.length];
}

function getMonthBounds(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

// ── Public API ────────────────────────────────────

/** Get or initialize the current month's team challenge. */
export function getCurrentChallenge(): TeamChallengeState & {
  template: ChallengeTemplate;
  daysRemaining: number;
  milestones: MilestoneThreshold[];
  progressPct: number;
} {
  const template = selectMonthlyChallenge();
  const bounds = getMonthBounds();
  let state = readState();

  // Reset if challenge is from a different month
  if (!state?.challengeId || state.challengeId !== template.id || state.startDate !== bounds.start) {
    state = {
      challengeId: template.id,
      startDate: bounds.start,
      endDate: bounds.end,
      progress: 0,
      contributions: [],
    };
    writeState(state);
  }

  const now = new Date();
  const endDate = new Date(state.endDate + "T23:59:59");
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86_400_000));

  const progressPct = Math.min(100, Math.round((state.progress / template.target) * 100));

  const milestones: MilestoneThreshold[] = [
    { pct: 25, label: "25%", reached: progressPct >= 25 },
    { pct: 50, label: "Metade!", reached: progressPct >= 50 },
    { pct: 75, label: "75%", reached: progressPct >= 75 },
    { pct: 100, label: "Meta atingida!", reached: progressPct >= 100 },
  ];

  return { ...state, template, daysRemaining, milestones, progressPct };
}

/** Check how many contributions the user has made today for the active challenge. */
export function getTodayContributionCount(): number {
  const state = readState();
  if (!state) return 0;
  const today = todayKey();
  return state.contributions.filter(
    (c) => c.date === today && c.type === state.challengeId,
  ).length;
}

/**
 * Record a contribution to the current team challenge.
 * Returns { accepted, newTotal, reason? }.
 * Enforces daily per-person cap.
 */
export function contribute(amount: number = 1): {
  accepted: boolean;
  newTotal: number;
  reason?: string;
} {
  const challenge = getCurrentChallenge();
  const template = challenge.template;

  // Check daily cap
  const todayCount = getTodayContributionCount();
  if (todayCount >= template.capPerPersonPerDay) {
    return {
      accepted: false,
      newTotal: challenge.progress,
      reason: `Limite diário atingido (${template.capPerPersonPerDay}/${template.unit} por dia)`,
    };
  }

  // Check if already at target
  if (challenge.progress >= template.target) {
    return {
      accepted: false,
      newTotal: challenge.progress,
      reason: "Meta já atingida! 🎉",
    };
  }

  const state = readState();
  if (!state) return { accepted: false, newTotal: 0, reason: "Estado não encontrado" };
  const contribution: ContributionRecord = {
    date: todayKey(),
    amount,
    type: state.challengeId,
  };
  state.contributions.push(contribution);
  state.progress = Math.min(template.target, state.progress + amount);
  writeState(state);

  return { accepted: true, newTotal: state.progress };
}

/** Get the most recently crossed milestone (for celebration trigger). */
export function getLatestMilestone(): MilestoneThreshold | null {
  const { milestones } = getCurrentChallenge();
  const reached = milestones.filter((m) => m.reached);
  return reached.length > 0 ? (reached.at(-1) ?? null) : null;
}

/** Compute collective sky brightness level (0–1) from team progress. */
export function getCollectiveSkyLevel(): number {
  const { progressPct } = getCurrentChallenge();
  // Map 0–100% progress to 0.2–1.0 brightness
  return 0.2 + (progressPct / 100) * 0.8;
}
