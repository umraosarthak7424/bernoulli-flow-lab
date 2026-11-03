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
