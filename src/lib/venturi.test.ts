import { describe, expect, it } from "vitest";
import { normalizeControls, venturi } from "./venturi";

const base = { d1: 10, d2: 5, v1: 1.5, p1: 120, rho: 1000 };

describe("venturi", () => {
  it("halving diameter quadruples speed", () => {
    expect(venturi({ d1: 0.1, d2: 0.05, v1: 1, p1: 100000, rho: 1000 }).v2).toBeCloseTo(4);
  });
  it("throat pressure follows Bernoulli", () => {
    // P2 = 100000 + 0.5*1000*(1-16) = 92500
    expect(venturi({ d1: 0.1, d2: 0.05, v1: 1, p1: 100000, rho: 1000 }).p2).toBeCloseTo(92500);
  });
});

describe("normalizeControls", () => {
  it("throat cannot exceed inlet", () => {
    expect(normalizeControls({ ...base, d2: 15 }).d2).toBe(10);
  });
  it("shrinking inlet pulls throat down with it", () => {
    expect(normalizeControls({ ...base, d1: 4, d2: 5 })).toMatchObject({ d1: 4, d2: 4 });
  });
  it("throat is at least 1 cm", () => {
    expect(normalizeControls({ ...base, d2: 0.2 }).d2).toBe(1);
  });
  it("NaN input keeps previous value", () => {
    expect(normalizeControls({ ...base, v1: NaN }, base).v1).toBe(1.5);
  });
  it("extreme settings give finite outputs", () => {
    const c = normalizeControls({ d1: 20, d2: 1, v1: 5, p1: 20, rho: 1500 });
    const r = venturi({ d1: c.d1 / 100, d2: c.d2 / 100, v1: c.v1, p1: c.p1 * 1000, rho: c.rho });
    expect(Number.isFinite(r.p2) && Number.isFinite(r.v2)).toBe(true);
  });
});
