import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/model")({
  head: () => meta("Ideal Fluid Model & Continuity — Bernoulli's Theorem", "The assumptions behind Bernoulli's equation and the continuity equation A₁v₁ = A₂v₂."),
  component: Model,
});

const ASSUMPTIONS = [
  ["Incompressible", "Density ρ is constant everywhere."],
  ["Non-viscous", "No internal friction, so no energy lost to heat."],
  ["Steady flow", "Velocity at any point does not change with time."],
  ["Irrotational / along a streamline", "Energy balance is applied along one streamline."],
];

function Model() {
  const [ratio, setRatio] = useState(2);
  const v1 = 1;
  const v2 = v1 * ratio;
  const h2 = 60 / ratio;
  return (
    <>
      <PageHero kicker="Stage 02 · Idealization" title="Build an ideal fluid model.">
        Real fluids are messy. To isolate the key physics we keep only what matters and state every assumption clearly.
      </PageHero>
      <section className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-semibold">Assumptions</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ASSUMPTIONS.map(([t, d]) => (
            <Card key={t}><h3 className="text-lg font-semibold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></Card>
          ))}
        </div>
        <h2 className="mt-16 text-3xl font-semibold">What stays in our model? Energy per unit volume.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card><p className="eq text-2xl text-accent">P</p><h3 className="mt-2 text-lg font-semibold">Pressure energy</h3><p className="mt-1 text-sm text-muted-foreground">Work done by pressure per unit volume (J/m³ = Pa).</p></Card>
          <Card><p className="eq text-2xl text-accent">½ρv²</p><h3 className="mt-2 text-lg font-semibold">Kinetic energy per unit volume</h3><p className="mt-1 text-sm text-muted-foreground">½mv² divided by volume V = m/ρ.</p></Card>
          <Card><p className="eq text-2xl text-accent">ρgh</p><h3 className="mt-2 text-lg font-semibold">Gravitational PE per unit volume</h3><p className="mt-1 text-sm text-muted-foreground">mgh divided by volume V.</p></Card>
        </div>
        <h2 className="mt-16 text-3xl font-semibold">Follow a fluid element: continuity</h2>
        <Card className="mt-6">
          <svg viewBox="0 0 600 160" className="w-full">
            <path d={`M20 20 L220 20 C300 20 300 ${80 - h2 / 2} 380 ${80 - h2 / 2} L580 ${80 - h2 / 2} L580 ${80 + h2 / 2} L380 ${80 + h2 / 2} C300 ${80 + h2 / 2} 300 140 220 140 L20 140 Z`} fill="color-mix(in oklab, var(--primary) 18%, transparent)" stroke="var(--primary)" strokeWidth="2" />
            {[50, 80, 110].map((y) => (
              <path key={y} d={`M20 ${y} L220 ${y} C300 ${y} 300 ${80 + ((y - 80) * h2) / 120} 380 ${80 + ((y - 80) * h2) / 120} L580 ${80 + ((y - 80) * h2) / 120}`} fill="none" stroke="var(--foreground)" strokeOpacity=".6" style={{ animationDuration: `${1.2 / ratio}s` }} className="animate-flow" />
            ))}
            <text x="110" y="155" fill="var(--accent)" fontSize="13" textAnchor="middle">A₁, v₁ = {v1.toFixed(1)} m/s</text>
            <text x="480" y={80 + h2 / 2 + 16} fill="var(--accent)" fontSize="13" textAnchor="middle">A₂ = A₁/{ratio.toFixed(1)}, v₂ = {v2.toFixed(1)} m/s</text>
          </svg>
          <label className="mt-4 block text-sm text-muted-foreground">Area ratio A₁/A₂: <span className="text-foreground">{ratio.toFixed(1)}</span></label>
          <input type="range" min={1} max={4} step={0.1} value={ratio} onChange={(e) => setRatio(+e.target.value)} className="w-full accent-primary" />
          <p className="eq mt-4 text-center text-xl">A₁v₁ = A₂v₂ <span className="text-muted-foreground">(volume flow rate Q is constant)</span></p>
          <p className="mt-3 text-muted-foreground">In time Δt, the volume entering (A₁v₁Δt) must equal the volume leaving (A₂v₂Δt) because the fluid is incompressible. So a narrower pipe forces faster flow.</p>
        </Card>
      </section>
      <NextLink to="/venturi" label="Enter the Venturi Lab" />
    </>
  );
}
