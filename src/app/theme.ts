export type Theme = 'light' | 'dark';
const KEY = 'orbit:theme:v1';

export function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* Storage may be unavailable; the system preference still works. */ }
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function persistTheme(theme: Theme): boolean {
  try { localStorage.setItem(KEY, theme); return true; } catch { return false; }
}
