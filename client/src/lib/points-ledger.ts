/**
 * Points ledger — unified persistence for Solar Points.
 *
 * Aggregates points from:
 *   - Daily check-in (12 pts)
 *   - Micro-moods (3 pts each, max 2/day = 6 pts)
 *   - Completed missions (variable per mission)
 *   - Daily constancy bonus (5 pts for consecutive days)
 *
 * DEBT: replace localStorage with API integration when backend ready
 */

import { POINT_VALUES } from "@/lib/mission-engine";
import { getRecentRecords, getTodayScores, type DailyCheckInRecord } from "@/lib/score-engine";

// ── Storage ───────────────────────────────────────

const MISSIONS_KEY = "juphdcare_missions";

export interface MissionDayState {
  date: string;
  completed: string[];
  solarPoints: number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readMissionState(): MissionDayState {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MissionDayState;
      if (parsed.date === todayKey()) return parsed;
    }
  } catch { /* corrupted — reset */ }
  return { date: todayKey(), completed: [], solarPoints: 0 };
}

export function writeMissionState(state: MissionDayState): void {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(state));
}

// ── Point calculations ────────────────────────────

/** Points earned from today's check-in. */
export function getCheckinPoints(): number {
  const scores = getTodayScores();
  return scores.hasCheckedIn ? POINT_VALUES.checkin : 0;
}

/** Points earned from today's micro-moods (max 2). */
export function getMicroMoodPoints(): number {
  const records = getRecentRecords(1);
  if (records.length === 0) return 0;
  const today = records.find((r) => r.date === todayKey());
  if (!today) return 0;
  const count = Math.min(today.microMoods.length, POINT_VALUES.microchecksMaxPerDay);
  return count * POINT_VALUES.microcheck;
}

/** Points earned from completed missions today. */
export function getMissionPoints(): number {
  return readMissionState().solarPoints;
}

/** Constancy bonus: 5 pts if user checked in yesterday too. */
export function getConstancyBonus(): number {
  const recent = getRecentRecords(2);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const hasYesterday = recent.some((r) => r.date === yesterdayKey);
  const hasToday = recent.some((r) => r.date === todayKey());
  return hasYesterday && hasToday ? POINT_VALUES.dailyConstancyBonus : 0;
}

/** Total Solar Points earned today. */
export function getTotalPointsToday(): number {
  return (
    getCheckinPoints() +
    getMicroMoodPoints() +
    getMissionPoints() +
    getConstancyBonus()
  );
}

// ── Constancy streak ──────────────────────────────

export interface ConstancyDay {
  date: string;
  active: boolean;
}

/** Check-in constancy for the last N days (most recent first). */
export function getConstancyDays(count: number): ConstancyDay[] {
  const records = getRecentRecords(count);
  const recordDates = new Set(records.map((r) => r.date));
  const days: ConstancyDay[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, active: recordDates.has(key) });
  }

  return days;
}
