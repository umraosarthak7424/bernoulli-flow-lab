/** Simplified physics models used by the game. SI units internally. */
export const G = 9.81;
export const RHO_WATER = 1000;

/** Ideal (Bernoulli, frictionless) exit speed from a pressure difference: v = √(2ΔP/ρ). */
export function idealJetSpeed(dpPa: number, rho = RHO_WATER): number {
  return dpPa > 0 && rho > 0 ? Math.sqrt((2 * dpPa) / rho) : 0;
}

export const BLASTER_LIMITS = {
  dp: { min: 20, max: 200, step: 5 }, // kPa
  d: { min: 2, max: 10, step: 0.5 }, // mm
  supply: { min: 2, max: 30, step: 1 }, // L/min
} as const;
export const NOZZLE_HEIGHT = 1.0; // m, horizontal shot

/**
 * Water blaster model (inputs: ΔP kPa, nozzle d mm, pump supply L/min).
 * The ideal speed √(2ΔP/ρ) only holds if the pump can supply Q = A·v.
 * If it can't, the flow is supply-limited: Q = supply and v = Q/A (lower than ideal).
 * Range: horizontal launch from 1 m, no drag (simplified).
 */
export function blaster(input: { dpKpa: number; dMm: number; supplyLpm: number }) {
  const vIdeal = idealJetSpeed(input.dpKpa * 1000);
  const area = (Math.PI * (input.dMm / 1000) ** 2) / 4;
  const qDemand = area * vIdeal; // m³/s
  const qSupply = input.supplyLpm / 1000 / 60;
  const supplyLimited = qSupply < qDemand;
  const q = Math.min(qDemand, qSupply);
  const v = area > 0 ? q / area : 0;
  const range = v * Math.sqrt((2 * NOZZLE_HEIGHT) / G);
  return { vIdeal, v, area, qLpm: q * 60000, demandLpm: qDemand * 60000, supplyLimited, range };
}

export const ZOMBIES = [
  { name: "Gloopy", dist: 3, minFlow: 0, quip: "Bleh! I'm melting… into a puddle of giggles!" },
  { name: "Sir Soggy", dist: 6, minFlow: 0, quip: "My hat! My beautiful hat is soaked!" },
  { name: "Big Burp", dist: 8.5, minFlow: 12, quip: "Okay okay, I'll go take a bath!" },
] as const;
export const HIT_TOLERANCE = 0.8; // m

export function shotResult(r: ReturnType<typeof blaster>, z: (typeof ZOMBIES)[number]) {
  const off = r.range - z.dist;
  if (Math.abs(off) > HIT_TOLERANCE) return off < 0 ? "short" : "long";
  return r.qLpm + 1e-9 < z.minFlow ? "weak" : "hit";
}

/** Continuity: v₂ = v₁·A₁/A₂ (incompressible). */
export function continuityV2(a1: number, v1: number, a2: number) {
  return (a1 * v1) / a2;
}
