"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  isTheme,
  resolveTheme,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

type ThemeState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
};

const listeners = new Set<() => void>();
const serverState: ThemeState = { theme: "system", resolvedTheme: "light" };

let state: ThemeState = serverState;
let didInit = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function readStoredTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : "system";
}

function syncState(theme: Theme) {
  const resolvedTheme = resolveTheme(theme);
  applyResolvedTheme(resolvedTheme);

  if (state.theme === theme && state.resolvedTheme === resolvedTheme) {
    return;
  }

  state = { theme, resolvedTheme };
}

function init() {
  if (didInit || typeof window === "undefined") return;
  didInit = true;
  syncState(readStoredTheme());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  init();

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    syncState(state.theme);
    emit();
  };

  media.addEventListener("change", onMedia);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onMedia);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return serverState;
}

export function setTheme(theme: Theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  syncState(theme);
  emit();
}

export function useTheme() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    theme: snapshot.theme,
    resolvedTheme: snapshot.resolvedTheme,
    setTheme,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return children;
}
