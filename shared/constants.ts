/**
 * Shared constants — single source of truth for magic numbers.
 *
 * Imported by both client and server. NEVER put React or Express
 * imports here — pure values only.
 */

// ── Time ──────────────────────────────────────────

/** Check-ins between 00:00 and this hour count toward the previous work day. */
export const DAY_BOUNDARY_HOUR = 4;

// ── Privacy ───────────────────────────────────────

/** Minimum group size for k-anonymity in RH aggregates. */
export const ANONYMITY_THRESHOLD = 5;

// ── Solar Points ──────────────────────────────────

export const POINT_VALUES = {
  checkin: 12,
  checkinPartial: 5,
  microcheck: 3,
  microchecksMaxPerDay: 2,
  pulseSurvey: 15,
  missionSimple: 5,
  missionMedium: 8,
  missionSupport: 6,
  dailySequenceBonus: 5,
  streak3Days: 8,
  streak7Days: 15,
  streak66Days: 50,
  returnAfterAbsence: 3,
  firstCheckinOfWeek: 2,
} as const;

// ── Follow-up delta (energy Q4) ───────────────────

export const DELTA_FATIGUE = {
  sim: 0.5,
  maisOuMenos: 0.2,
  nao: 0,
} as const;

// ── IRP formula helpers ───────────────────────────

/** Maximum score for HLB proxy (Q6 "Liderança/Gestão" tag frequency). */
export const HLB_MAX = 5;

/** Maximum score for ICE momentânea (Q5 single-choice). */
export const ICE_MAX = 4;

// ── Stepped care escalation ───────────────────────

export const ESCALATION_LEVELS = {
  level1: "ia",       // AI chatbot (RAG)
  level2: "cvv_caps", // CVV 188 / CAPS referral
  level3: "org",      // Organization escalation (RH notification)
} as const;

// ── Modo Respiro ──────────────────────────────────

/** Consecutive days of SKY_REST to auto-enter Respiro. */
export const RESPIRO_AUTO_ENTRY_DAYS = 2;

/** Consecutive days of SKY_PARTIAL+ to auto-exit Respiro. */
export const RESPIRO_AUTO_EXIT_DAYS = 2;

// ── Pulse Survey ──────────────────────────────────

/** Days between pulse surveys. */
export const PULSE_SURVEY_INTERVAL_DAYS = 45;
