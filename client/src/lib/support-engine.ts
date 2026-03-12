/**
 * Support engine — selects curated messages based on user state.
 *
 * Selection criteria (NASA-grade weighted decision tree):
 *   1. Category filter (user choice)
 *   2. Tag affinity: messages whose tags match current flags score higher
 *   3. Recency avoidance: messages seen recently are deprioritized
 *   4. State-aware ordering: respiro/protective skew toward calma and acolhimento
 *
 * Favorites persist in localStorage.
 * DEBT: replace with API calls when backend delivers GET /api/support-messages
 */

import type { SkyState } from "@/lib/checkin-data";
import type { TodayScores } from "@/lib/score-engine";
import {
  SUPPORT_MESSAGES,
  type SupportCategory,
  type SupportMessage,
} from "@/lib/support-messages";

// ── Modo Respiro state ────────────────────────────

const RESPIRO_KEY = "juphdcare_respiro";

export interface RespiroState {
  active: boolean;
  activatedAt: string | null; // ISO timestamp
  needSupportCount: number;   // "Preciso de apoio" taps in last 24h
  lastNeedSupportAt: string | null;
}

function readRespiroState(): RespiroState {
  try {
    const raw = localStorage.getItem(RESPIRO_KEY);
    if (raw) return JSON.parse(raw) as RespiroState;
  } catch { /* corrupted — reset */ }
  return { active: false, activatedAt: null, needSupportCount: 0, lastNeedSupportAt: null };
}

function writeRespiroState(state: RespiroState): void {
  localStorage.setItem(RESPIRO_KEY, JSON.stringify(state));
}

/** Check if Modo Respiro should be active. Auto-entry + auto-exit logic. */
export function evaluateRespiro(scores: TodayScores): boolean {
  const state = readRespiroState();

  // Auto-entry: skyState is respiro (score < 25) → activate
  if (scores.skyState === "respiro") {
    if (!state.active) {
      state.active = true;
      state.activatedAt = new Date().toISOString();
      writeRespiroState(state);
    }
    return true;
  }

  // Auto-entry: "Preciso de apoio" tapped ≥ 2 times in 24h
  if (state.needSupportCount >= 2) {
    const lastTap = state.lastNeedSupportAt
      ? new Date(state.lastNeedSupportAt).getTime()
      : 0;
    const within24h = Date.now() - lastTap < 24 * 60 * 60 * 1000;
    if (within24h && !state.active) {
      state.active = true;
      state.activatedAt = new Date().toISOString();
      writeRespiroState(state);
      return true;
    }
  }

  // If currently active, check exit conditions
  if (state.active) {
    // Exit: scores improved (skyState not respiro for at least this read)
    // For simplicity: if skyState ≥ partly-cloudy, allow manual deactivation
    // Full spec: "scores improve for 2 consecutive days" — deferred to backend
    return true;
  }

  return false;
}

/** Record a "Preciso de apoio" tap for Modo Respiro entry tracking. */
export function recordNeedSupport(): void {
  const state = readRespiroState();
  const now = Date.now();

  // Reset counter if last tap was > 24h ago
  if (state.lastNeedSupportAt) {
    const lastTime = new Date(state.lastNeedSupportAt).getTime();
    if (now - lastTime > 24 * 60 * 60 * 1000) {
      state.needSupportCount = 0;
    }
  }

  state.needSupportCount += 1;
  state.lastNeedSupportAt = new Date().toISOString();
  writeRespiroState(state);
}

/** Manually deactivate Modo Respiro. */
export function deactivateRespiro(): void {
  const state = readRespiroState();
  state.active = false;
  state.activatedAt = null;
  state.needSupportCount = 0;
  writeRespiroState(state);
}

/** Read current Modo Respiro state. */
export function getRespiroState(): RespiroState {
  return readRespiroState();
}

// ── Favorites ─────────────────────────────────────

const FAVORITES_KEY = "juphdcare_support_favorites";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function writeFavorites(favs: Set<string>): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
}

export function toggleFavorite(messageId: string): boolean {
  const favs = readFavorites();
  if (favs.has(messageId)) {
    favs.delete(messageId);
    writeFavorites(favs);
    return false;
  }
  favs.add(messageId);
  writeFavorites(favs);
  return true;
}

export function isFavorite(messageId: string): boolean {
  return readFavorites().has(messageId);
}

export function getFavoriteMessages(): SupportMessage[] {
  const favIds = readFavorites();
  return SUPPORT_MESSAGES.filter((m) => favIds.has(m.id));
}

// ── Message seen history ──────────────────────────

const SEEN_KEY = "juphdcare_support_seen";

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

function recordSeen(messageId: string): void {
  const seen = readSeen();
  // Keep last 20 to avoid localStorage bloat
  const updated = [messageId, ...seen.filter((id) => id !== messageId)].slice(0, 20);
  localStorage.setItem(SEEN_KEY, JSON.stringify(updated));
}

// ── Selection engine ──────────────────────────────

interface SelectionContext {
  category: SupportCategory;
  skyState: SkyState;
  flags: string[];
}

/** Select the best message for the given context. Returns a single message. */
export function selectSupportMessage(ctx: SelectionContext): SupportMessage {
  const pool = SUPPORT_MESSAGES.filter((m) => m.category === ctx.category);
  const seen = new Set(readSeen());

  // Score each message
  const scored = pool.map((m) => {
    let score = 1;

    // Tag affinity: +2 per matching flag
    for (const tag of m.tags) {
      if (ctx.flags.includes(tag)) score += 2;
    }

    // Recency penalty
    if (seen.has(m.id)) score *= 0.3;

    // State-aware boost for calma/acolhimento under stress
    if (
      (ctx.skyState === "respiro" || ctx.skyState === "protective-cloud") &&
      (m.category === "calma" || m.category === "acolhimento")
    ) {
      score += 1;
    }

    return { message: m, score };
  });

  // Sort by score descending, pick top
  scored.sort((a, b) => b.score - a.score);
  const chosen = scored[0]?.message ?? pool[0];

  recordSeen(chosen.id);
  return chosen;
}

/** Get all messages for a category (for browsing). */
export function getMessagesByCategory(category: SupportCategory): SupportMessage[] {
  return SUPPORT_MESSAGES.filter((m) => m.category === category);
}
