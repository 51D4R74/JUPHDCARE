/**
 * Score engine — client-side scoring for daily check-ins.
 *
 * Server is the canonical store since S13. This module provides:
 *   (a) `computeCheckInResult` — pure domain-score + flag computation (no side-effects)
 *   (b) `computeTagCloud` — pure tag-frequency aggregator for server history
 *   (c) `getDomainMeta` — static metadata for score domains
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
} from "@/lib/checkin-data";

// ── Types ─────────────────────────────────────────

export interface TodayScores {
  domainScores: Record<ScoreDomainId, number>;
  skyState: SkyState;
  solarHaloLevel: number;
  flags: string[];
  hasCheckedIn: boolean;
}

// ── Helpers ───────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Public API ────────────────────────────────────

/** Pure computation of domain scores + flags from raw answers. No side-effects. */
export function computeCheckInResult(
  answers: Record<string, string | string[]>,
): { date: string; answers: Record<string, string | string[]>; domainScores: Record<ScoreDomainId, number>; flags: string[] } {
  return {
    date: todayKey(),
    answers,
    domainScores: computeDomainScores(answers),
    flags: collectFlags(answers, DAILY_STEPS),
  };
}

/** Get domain metadata (labels, descriptions). */
export function getDomainMeta() {
  return SCORE_DOMAINS;
}

/** Chart color per score domain — single source of truth. */
export const DOMAIN_COLORS: Record<ScoreDomainId, string> = {
  recarga: "hsl(142 71% 45%)",              // score-good
  "estado-do-dia": "hsl(44 90% 51%)",        // brand-gold
  "seguranca-relacional": "hsl(187 62% 44%)", // brand-teal
};

// ── M3 helpers ────────────────────────────────────

export interface TagCount {
  flag: string;
  label: string;
  count: number;
}

/**
 * Pure tag-frequency aggregator. Accepts any record array with a `flags` field.
 * Used by pages that receive server history.
 */
export function computeTagCloud(
  records: ReadonlyArray<{ readonly flags: string[] }>,
): TagCount[] {
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
    .toSorted((a, b) => b.count - a.count);
}
