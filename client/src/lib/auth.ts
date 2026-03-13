import { useSyncExternalStore } from "react";

interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly name: string;
  readonly role: string;
  readonly department: string | null;
}

let currentUser: AuthUser | null = null;
const listeners = new Set<() => void>();

const stored = globalThis.window === undefined ? null : localStorage.getItem("juphd_user");
if (stored) {
  try { currentUser = JSON.parse(stored); } catch { /* corrupt – ignore */ }
}

function emit() {
  listeners.forEach((l) => l());
}

function setUser(u: AuthUser | null) {
  currentUser = u;
  if (u) localStorage.setItem("juphd_user", JSON.stringify(u));
  else localStorage.removeItem("juphd_user");
  emit();
}

async function logout() {
  setUser(null);
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch { /* best-effort server cleanup */ }
}

/** Validate the server session and sync client state. */
async function validateSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) {
      const user: AuthUser = await res.json();
      setUser(user);
      return user;
    }
  } catch { /* network error – keep stale client state */ }
  // Session gone → clear client state
  setUser(null);
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot() {
  return currentUser;
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    user,
    setUser,
    logout,
    validateSession,
    isAuthenticated: !!user,
    isRH: user?.role === "rh",
  };
}
