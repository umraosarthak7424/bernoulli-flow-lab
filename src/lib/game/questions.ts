export type Q = { q: string; options: string[]; a: number; hint: string; why: string };

export const BUBBLE_ROUNDS: Q[] = [
  { q: "Air speeds up over the top of a curved paper strip. The pressure there…", options: ["Drops", "Rises", "Stays the same"], a: 0, hint: "Faster flow, ___ pressure (same height).", why: "Along a streamline, faster flow has lower pressure, so the strip is pushed up." },
  { q: "A river flows into a narrower channel. The water there moves…", options: ["Slower", "Faster", "Backwards"], a: 1, hint: "The same amount of water must squeeze through each second.", why: "Continuity: A₁v₁ = A₂v₂, so smaller area means higher speed." },
  { q: "Bernoulli's equation comes from conservation of…", options: ["Charge", "Energy", "Mass only"], a: 1, hint: "Pressure, motion and height are forms of…", why: "It is the work–energy idea applied to a moving ideal fluid." },
  { q: "Which term in P + ½ρv² + ρgh stands for height energy?", options: ["P", "½ρv²", "ρgh"], a: 2, hint: "Look for g (gravity).", why: "ρgh is gravitational potential energy per unit volume." },
  { q: "Simple Bernoulli works best for a fluid that is…", options: ["Thick and sticky", "Ideal: no friction, constant density", "Boiling"], a: 1, hint: "Think of a perfect, friction-free fluid.", why: "The model assumes steady, incompressible, non-viscous flow along a streamline." },
  { q: "Why does a wing produce lift?", options: ["Air on top must 'catch up' with air below", "It turns air downward; pressure is lower on top", "Wings are lighter than air"], a: 1, hint: "The 'equal transit time' story is a myth!", why: "A wing deflects air downward; the faster flow over the top has lower pressure. Air on top actually arrives earlier, not 'at the same time'." },
];

export const SKYSHIP: Q[] = [
  { q: "ENGINE LEAK! The fuel line narrows from 6 cm² to 2 cm². Fuel enters at 1 m/s. Speed in the narrow part?", options: ["3 m/s", "1/3 m/s", "12 m/s"], a: 0, hint: "A₁v₁ = A₂v₂", why: "v₂ = 6 × 1 ÷ 2 = 3 m/s." },
  { q: "STORM! Wind rushes fast over the balloon's top. What happens to pressure above it?", options: ["Lower than the still air", "Higher than the still air", "No change"], a: 0, hint: "Fast flow, low pressure.", why: "Faster moving air along the flow has lower pressure than slower air." },
  { q: "WATER CANNON! ΔP = 50 kPa pushes water (ρ = 1000 kg/m³). Ideal exit speed? (v = √(2ΔP/ρ))", options: ["10 m/s", "100 m/s", "5 m/s"], a: 0, hint: "2 × 50 000 ÷ 1000 = 100, then take the square root.", why: "v = √(2 × 50 000 / 1000) = √100 = 10 m/s (ideal, no friction)." },
  { q: "The venturimeter reads lower pressure at the throat than at the inlet. This means the throat flow is…", options: ["Slower", "Faster", "Stopped"], a: 1, hint: "Pressure turned into…", why: "In a horizontal Venturi, the pressure drop is what speeds the fluid up in the throat." },
  { q: "A pipe climbs upward but keeps the same width. Speed is constant. Pressure at the top is…", options: ["Lower (ρgh rises)", "Higher", "The same"], a: 0, hint: "Same v, so trade P against ρgh.", why: "With ½ρv² fixed, a higher ρgh must be balanced by lower P." },
  { q: "FINAL BURN! Which claim about narrowing a hose nozzle is correct?", options: ["Narrower always means faster, no matter what", "It speeds the jet only if the pump keeps up the pressure", "It always slows the jet"], a: 1, hint: "Remember the water gun supply limit.", why: "Exit speed is set by ΔP (v ≈ √(2ΔP/ρ)). A narrower nozzle helps reach that speed only when supply and pressure can be maintained." },
];
