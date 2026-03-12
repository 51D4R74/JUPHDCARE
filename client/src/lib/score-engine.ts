/**
 * Score engine — client-side scoring for daily check-ins.
 *
 * Computes Recarga, Estado do dia, Segurança relacional from local data.
 * DEBT: replace localStorage stub with API integration when backend ready
 */

import {
  type ScoreDomainId,
  type SkyState,
  DAILY_STEPS,
  SCORE_DOMAINS,
  CONTEXT_TAG_FLAGS,
  CONTEXT_TAG_LABELS,
  computeDomainScores,
  collectFlags,
  deriveSkyState,
} from "@/lib/checkin-data";
import type { MicroMoodId } from "@/components/one-tap-mood";

// ── Types ─────────────────────────────────────────

export interface DailyCheckInRecord {
  date: string; // ISO date (YYYY-MM-DD)
  answers: Record<string, string | string[]>;
  domainScores: Record<ScoreDomainId, number>;
  flags: string[];
  microMoods: MicroMoodEntry[];
}

export interface MicroMoodEntry {
  timestamp: number;
  mood: MicroMoodId;
}

export interface TodayScores {
  domainScores: Record<ScoreDomainId, number>;
  skyState: SkyState;
  solarHaloLevel: number;
  flags: string[];
  hasCheckedIn: boolean;
}

// ── Storage key ───────────────────────────────────

const STORAGE_KEY = "juphdcare_checkins";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Read/write ────────────────────────────────────

function readStore(): Record<string, DailyCheckInRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Record<string, DailyCheckInRecord> : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, DailyCheckInRecord>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ── Public API ────────────────────────────────────

/** Save a completed daily check-in. */
export function saveDailyCheckIn(
  answers: Record<string, string | string[]>,
): DailyCheckInRecord {
  const domainScores = computeDomainScores(answers);
  const flags = collectFlags(answers, DAILY_STEPS);
  const date = todayKey();

  const record: DailyCheckInRecord = {
    date,
    answers,
    domainScores,
    flags,
    microMoods: [],
  };

  const store = readStore();
  store[date] = record;
  writeStore(store);

  return record;
}

/** Append a micro-mood entry to today's record. */
export function saveMicroMood(mood: MicroMoodId): void {
  const store = readStore();
  const date = todayKey();
  const record = store[date];
  if (!record) return;

  record.microMoods.push({ timestamp: Date.now(), mood });
  writeStore(store);
}

/** Get today's scores or a default empty state. */
export function getTodayScores(): TodayScores {
  const store = readStore();
  const record = store[todayKey()];

  if (!record) {
    const empty: Record<ScoreDomainId, number> = {
      recarga: 0,
      "estado-do-dia": 0,
      "seguranca-relacional": 0,
    };
    return {
      domainScores: empty,
      skyState: "partly-cloudy",
      solarHaloLevel: 0.5,
      flags: [],
      hasCheckedIn: false,
    };
  }

  const { skyState, solarHaloLevel } = deriveSkyState(record.domainScores, record.flags);

  return {
    domainScores: record.domainScores,
    skyState,
    solarHaloLevel,
    flags: record.flags,
    hasCheckedIn: true,
  };
}

/** Get check-in records for the last N days. */
export function getRecentRecords(days: number): DailyCheckInRecord[] {
  const store = readStore();
  const now = new Date();
  const result: DailyCheckInRecord[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const record = store[key];
    if (record) result.push(record);
  }

  return result;
}

/** Get domain metadata (labels, descriptions). */
export function getDomainMeta() {
  return SCORE_DOMAINS;
}

// ── M3 helpers ────────────────────────────────────

export interface TagCount {
  flag: string;
  label: string;
  count: number;
}

/** Get all stored records sorted oldest → newest. */
export function getAllRecords(): DailyCheckInRecord[] {
  const store = readStore();
  return Object.values(store).sort((a, b) => a.date.localeCompare(b.date));
}

/** Aggregate context tag frequencies from the last N days. */
export function getTagCloud(days: number): TagCount[] {
  const records = getRecentRecords(days);
  const counts: Record<string, number> = {};
  for (const record of records) {
    for (const flag of record.flags) {
      if (CONTEXT_TAG_FLAGS.includes(flag)) {
        counts[flag] = (counts[flag] ?? 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([flag, count]) => ({ flag, label: CONTEXT_TAG_LABELS[flag] ?? flag, count }))
    .sort((a, b) => b.count - a.count);
}
