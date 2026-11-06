import { describe, expect, it } from "vitest";
import { fallingStreamDiameter } from "./water-stream";

describe("fallingStreamDiameter", () => {
  it("narrows as the falling stream accelerates", () => {
    const top = fallingStreamDiameter(20, 1.4, 0);
    const lower = fallingStreamDiameter(20, 1.4, 1);
    const lowerStill = fallingStreamDiameter(20, 1.4, 2);
    expect(top).toBe(20);
    expect(lower).toBeLessThan(top);
    expect(lowerStill).toBeLessThan(lower);
  });
  it("preserves continuity for the ideal falling jet", () => {
    const v0 = 1.4, d0 = 20, h = 1.5;
    const v = Math.sqrt(v0 ** 2 + 2 * 9.81 * h);
    const d = fallingStreamDiameter(d0, v0, h);
    expect((d / d0) ** 2 * v).toBeCloseTo(v0, 8);
  });
});
