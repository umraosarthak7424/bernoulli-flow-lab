/** Horizontal Venturi: continuity + Bernoulli. Units SI. */
export function venturi(opts: { d1: number; d2: number; v1: number; p1: number; rho: number }) {
  const { d1, d2, v1, p1, rho } = opts;
  const a1 = (Math.PI * d1 * d1) / 4;
  const a2 = (Math.PI * d2 * d2) / 4;
  const v2 = (v1 * a1) / a2;
  const p2 = p1 + 0.5 * rho * (v1 * v1 - v2 * v2);
  const q = a1 * v1;
  const dh = (p1 - p2) / (rho * 9.81); // manometer head difference in fluid column (m)
  return { a1, a2, v2, p2, q, dp: p1 - p2, dh };
}

export const LIMITS = {
  d1: { min: 4, max: 20, step: 0.5 },
  d2: { min: 1, max: 20, step: 0.5 },
  v1: { min: 0.2, max: 5, step: 0.1 },
  p1: { min: 20, max: 180, step: 1 },
  rho: { min: 1, max: 1500, step: 1 },
} as const;

export type Controls = { d1: number; d2: number; v1: number; p1: number; rho: number };

const clamp = (n: number, lo: number, hi: number, fallback: number) =>
  Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;

/** Clamp every control to its range and enforce 1 cm ≤ d2 ≤ d1 (UI units: cm, m/s, kPa, kg/m³). */
export function normalizeControls(c: Controls, prev: Controls = c): Controls {
  const d1 = clamp(c.d1, LIMITS.d1.min, LIMITS.d1.max, prev.d1);
  return {
    d1,
    d2: clamp(c.d2, LIMITS.d2.min, d1, Math.min(prev.d2, d1)),
    v1: clamp(c.v1, LIMITS.v1.min, LIMITS.v1.max, prev.v1),
    p1: clamp(c.p1, LIMITS.p1.min, LIMITS.p1.max, prev.p1),
    rho: clamp(c.rho, LIMITS.rho.min, LIMITS.rho.max, prev.rho),
  };
}
