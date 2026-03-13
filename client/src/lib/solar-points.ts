/**
 * Solar points — engagement reward system.
 *
 * RULE 1: This file NEVER imports from checkin-data.ts or score-engine.ts.
 * RULE 2: awardPoints() NEVER receives skyState, domainScores, or emotion answers.
 * RULE 3: Streak frozen during Respiro, never penalized.
 *
 * All state is persisted in localStorage (client-side MVP).
 * BACKLOG: migrate to server-side with solar_points table [post-pilot]
 */

import { POINT_VALUES } from "@shared/constants";

// ── Types ─────────────────────────────────────────

export interface DailyLogEntry {
  readonly date: string;
  readonly points: number;
  readonly actions: readonly string[];
}

export interface SolarPointsState {
  readonly totalPoints: number;
  readonly currentStreak: number;
  readonly lastCheckinDate: string | null;
  readonly frozenDays: number;
  readonly inRespiroMode: boolean;
  readonly dailyLog: readonly DailyLogEntry[];
}

export interface HaloMetrics {
  /** Ring thickness tier 1–5 based on weekly points. */
  readonly thickness: 1 | 2 | 3 | 4 | 5;
  /** Color temperature label for the halo ring. */
  readonly temperature: "cold" | "warm" | "hot";
  /** Points earned in the rolling 7-day window. */
  readonly weekPoints: number;
  /** Consecutive check-in days (frozen during Respiro). */
  readonly streakDays: number;
  /** Whether the halo should pulse (streak ≥ 6). */
  readonly pulse: boolean;
}

export type PointAction =
  | "checkin"
  | "checkinPartial"
  | "microcheck"
  | "pulseSurvey"
  | "missionSimple"
  | "missionMedium"
  | "missionSupport";

// ── Storage ───────────────────────────────────────

const STORAGE_KEY = "juphdcare_solar_points";

function readState(): SolarPointsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SolarPointsState;
  } catch (e: unknown) {
    console.warn("Corrupted solar points state:", e);
  }
  return defaultState();
}

function writeState(state: SolarPointsState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function defaultState(): SolarPointsState {
  return {
    totalPoints: 0,
    currentStreak: 0,
    lastCheckinDate: null,
    frozenDays: 0,
    inRespiroMode: false,
    dailyLog: [],
  };
}

// ── Helpers ───────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Count points in a rolling 7-day window ending today. */
function weekPointsFromLog(log: readonly DailyLogEntry[]): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  return log
    .filter((e) => e.date > cutoffISO)
    .reduce((sum, e) => sum + e.points, 0);
}

/** Get the action's base point value. */
function basePoints(action: PointAction): number {
  const map: Record<PointAction, number> = {
    checkin: POINT_VALUES.checkin,
    checkinPartial: POINT_VALUES.checkinPartial,
    microcheck: POINT_VALUES.microcheck,
    pulseSurvey: POINT_VALUES.pulseSurvey,
    missionSimple: POINT_VALUES.missionSimple,
    missionMedium: POINT_VALUES.missionMedium,
    missionSupport: POINT_VALUES.missionSupport,
  };
  return map[action];
}

/** Check if a date is the day after another date. */
function isConsecutiveDay(prev: string, current: string): boolean {
  const d = new Date(prev);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10) === current;
}

/** Check if current date is in a new ISO week relative to last check-in. */
function isNewWeek(lastDate: string, currentDate: string): boolean {
  const last = new Date(lastDate);
  const curr = new Date(currentDate);
  // Monday-based ISO week comparison
  const getWeek = (d: Date) => {
    const jan1 = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + jan1.getDay() + 1) / 7);
  };
  return last.getFullYear() !== curr.getFullYear() || getWeek(last) !== getWeek(curr);
}

// ── Public API ────────────────────────────────────

/**
 * Award points for a completed action.
 * Returns the new state and the points actually awarded (including bonuses).
 */
export function awardPoints(
  action: PointAction,
): { state: SolarPointsState; awarded: number } {
  const prev = readState();
  const today = todayISO();
  let points = basePoints(action);
  let streak = prev.currentStreak;
  const actions: string[] = [];
  const existingEntry = prev.dailyLog.find((e) => e.date === today);

  // Microcheck daily cap
  if (action === "microcheck") {
    const todayMicrochecks = (existingEntry?.actions ?? [])
      .filter((a) => a === "microcheck").length;
    if (todayMicrochecks >= POINT_VALUES.microchecksMaxPerDay) {
      return { state: prev, awarded: 0 };
    }
  }

  actions.push(action);

  // Streak logic (only on checkin/checkinPartial)
  if (action === "checkin" || action === "checkinPartial") {
    if (prev.lastCheckinDate && isConsecutiveDay(prev.lastCheckinDate, today)) {
      streak += 1;
      // Daily sequence bonus
      points += POINT_VALUES.dailySequenceBonus;
      actions.push("dailySequenceBonus");

      // Milestone bonuses
      if (streak === 3) {
        points += POINT_VALUES.streak3Days;
        actions.push("streak3Days");
      }
      if (streak === 7) {
        points += POINT_VALUES.streak7Days;
        actions.push("streak7Days");
      }
      if (streak === 66) {
        points += POINT_VALUES.streak66Days;
        actions.push("streak66Days");
      }
    } else if (prev.lastCheckinDate && prev.lastCheckinDate !== today) {
      // Gap detected — return bonus if coming back
      if (streak > 0) {
        points += POINT_VALUES.returnAfterAbsence;
        actions.push("returnAfterAbsence");
      }
      streak = 1;
    } else if (!prev.lastCheckinDate) {
      streak = 1;
    }

    // First check-in of the week bonus
    if (!prev.lastCheckinDate || isNewWeek(prev.lastCheckinDate, today)) {
      points += POINT_VALUES.firstCheckinOfWeek;
      actions.push("firstCheckinOfWeek");
    }
  }

  // Build updated log entry
  const updatedLog: DailyLogEntry[] = [...prev.dailyLog.filter((e) => e.date !== today)];
  const mergedEntry: DailyLogEntry = {
    date: today,
    points: (existingEntry?.points ?? 0) + points,
    actions: [...(existingEntry?.actions ?? []), ...actions],
  };
  updatedLog.push(mergedEntry);

  // Keep only last 90 days of log
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  const trimmedLog = updatedLog.filter((e) => e.date >= cutoffISO);

  const newState: SolarPointsState = {
    totalPoints: prev.totalPoints + points,
    currentStreak: streak,
    lastCheckinDate: (action === "checkin" || action === "checkinPartial") ? today : prev.lastCheckinDate,
    frozenDays: prev.frozenDays,
    inRespiroMode: prev.inRespiroMode,
    dailyLog: trimmedLog,
  };

  writeState(newState);
  return { state: newState, awarded: points };
}

/**
 * Compute halo visual metrics from solar points state.
 * Pure function — no side effects.
 */
export function computeHaloMetrics(state?: SolarPointsState): HaloMetrics {
  const s = state ?? readState();
  const wp = weekPointsFromLog(s.dailyLog);

  // Thickness tiers based on weekly points brackets
  let thickness: 1 | 2 | 3 | 4 | 5;
  if (wp >= 80) thickness = 5;
  else if (wp >= 55) thickness = 4;
  else if (wp >= 35) thickness = 3;
  else if (wp >= 15) thickness = 2;
  else thickness = 1;

  // Temperature based on streak duration
  let temperature: "cold" | "warm" | "hot";
  if (s.currentStreak >= 7) temperature = "hot";
  else if (s.currentStreak >= 3) temperature = "warm";
  else temperature = "cold";

  return {
    thickness,
    temperature,
    weekPoints: wp,
    streakDays: s.currentStreak,
    pulse: s.currentStreak >= 6,
  };
}

/** Freeze streak during Modo Respiro. Called by support-engine. */
export function enterRespiroFreeze(): void {
  const state = readState();
  writeState({ ...state, inRespiroMode: true });
}

/** Unfreeze streak when exiting Modo Respiro. Called by support-engine. */
export function exitRespiroFreeze(): void {
  const state = readState();
  writeState({ ...state, inRespiroMode: false, frozenDays: 0 });
}

/** Get current solar points state (read-only). */
export function getSolarState(): SolarPointsState {
  return readState();
}

/** Get current halo metrics (convenience wrapper). */
export function getHaloMetrics(): HaloMetrics {
  return computeHaloMetrics(readState());
}
