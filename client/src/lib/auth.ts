import { useState, useEffect, useSyncExternalStore } from "react";

interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  department: string | null;
}

let currentUser: AuthUser | null = null;
const listeners = new Set<() => void>();

const stored = typeof window !== "undefined" ? localStorage.getItem("juphd_user") : null;
if (stored) {
  try { currentUser = JSON.parse(stored); } catch {}
}

function setUser(u: AuthUser | null) {
  currentUser = u;
  if (u) localStorage.setItem("juphd_user", JSON.stringify(u));
  else localStorage.removeItem("juphd_user");
  listeners.forEach((l) => l());
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
    logout: () => setUser(null),
    isAuthenticated: !!user,
    isRH: user?.role === "rh",
  };
}
