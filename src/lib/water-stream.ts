/** Diameter of a steady, incompressible free-falling jet from continuity and energy. */
export function fallingStreamDiameter(initialDiameter: number, initialSpeed: number, dropHeight: number, gravity = 9.81): number {
  const d0 = Math.max(0, Number.isFinite(initialDiameter) ? initialDiameter : 0);
  const v0 = Math.max(0.001, Number.isFinite(initialSpeed) ? initialSpeed : 0.001);
  const h = Math.max(0, Number.isFinite(dropHeight) ? dropHeight : 0);
  const g = Math.max(0, Number.isFinite(gravity) ? gravity : 9.81);
  const speed = Math.sqrt(v0 * v0 + 2 * g * h);
  return d0 * Math.sqrt(v0 / speed);
}
