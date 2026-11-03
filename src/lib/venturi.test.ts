import { describe, expect, it } from "vitest";
import { venturi } from "./venturi";

describe("venturi", () => {
  it("halving diameter quadruples speed", () => {
    expect(venturi({ d1: 0.1, d2: 0.05, v1: 1, p1: 100000, rho: 1000 }).v2).toBeCloseTo(4);
  });
  it("throat pressure follows Bernoulli", () => {
    // P2 = 100000 + 0.5*1000*(1-16) = 92500
    expect(venturi({ d1: 0.1, d2: 0.05, v1: 1, p1: 100000, rho: 1000 }).p2).toBeCloseTo(92500);
  });
});
