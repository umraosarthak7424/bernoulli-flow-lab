import { describe, expect, it } from "vitest";
import { EMPTY, answerXp, completeMission, isUnlocked, parseProgress, starsFor } from "./engine";
import { blaster, idealJetSpeed, shotResult, ZOMBIES } from "./physics";
import { LEVELS, isSolved, scramble } from "./pipes";

describe("Bernoulli Quest rules", () => {
  it("unlocks missions in order", () => {
    expect(isUnlocked(EMPTY, "bubble")).toBe(true);
    expect(isUnlocked(EMPTY, "watergun")).toBe(false);
    const { progress } = completeMission(EMPTY, "bubble", 3, 50);
    expect(isUnlocked(progress, "watergun")).toBe(true);
  });
  it("streak XP is 10, 15, 20 … capped at 30", () => {
    expect([1, 2, 3, 5, 9].map(answerXp)).toEqual([10, 15, 20, 30, 30]);
  });
  it("stars from mistakes", () => {
    expect([0, 1, 2, 3].map(starsFor)).toEqual([3, 2, 2, 1]);
  });
  it("badge awarded once and best stars kept", () => {
    const a = completeMission(EMPTY, "bubble", 3, 10);
    const b = completeMission(a.progress, "bubble", 1, 10);
    expect(a.newBadge).toBe("flow-explorer");
    expect(b.newBadge).toBeNull();
    expect(b.progress.stars.bubble).toBe(3);
    expect(b.progress.xp).toBe(20);
  });
  it("bad saved data falls back to a fresh start", () => {
    expect(parseProgress("{nope")).toEqual(EMPTY);
  });
});

describe("game physics", () => {
  it("ideal jet speed for 50 kPa water is 10 m/s", () => {
    expect(idealJetSpeed(50_000)).toBeCloseTo(10);
  });
  it("a weak pump limits jet speed below ideal", () => {
    const r = blaster({ dpKpa: 200, dMm: 10, supplyLpm: 2 });
    expect(r.supplyLimited).toBe(true);
    expect(r.v).toBeLessThan(r.vIdeal);
  });
  it("every zombie can be hit within the slider limits", () => {
    for (const z of ZOMBIES) {
      let ok = false;
      for (let dp = 20; dp <= 200 && !ok; dp += 5)
        for (let d = 2; d <= 10 && !ok; d += 0.5)
          ok = shotResult(blaster({ dpKpa: dp, dMm: d, supplyLpm: 30 }), z) === "hit";
      expect(ok, z.name).toBe(true);
    }
  });
});

describe("pipe maze", () => {
  it("each level's layout is solvable and starts scrambled", () => {
    for (const l of LEVELS) {
      expect(isSolved(l, l.tiles)).toBe(true);
      expect(isSolved(l, scramble(l))).toBe(false);
    }
  });
});
