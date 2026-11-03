import { createFileRoute } from "@tanstack/react-router";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/derivation")({
  head: () => meta("Deriving Bernoulli's Equation — Step by Step", "A rigorous work–energy derivation of Bernoulli's equation with diagram and video."),
  component: Derivation,
});

const STEPS: [string, string, string][] = [
  ["Continuity", "In time Δt the same volume ΔV passes both ends of the element (incompressible):", "ΔV = A₁v₁Δt = A₂v₂Δt"],
  ["Work by pressure", "Pressure at end 1 pushes forward (+), pressure at end 2 resists (−):", "W_P = P₁A₁(v₁Δt) − P₂A₂(v₂Δt) = (P₁ − P₂)ΔV"],
  ["Work by gravity", "The mass Δm = ρΔV effectively moves from height h₁ to h₂:", "W_g = −Δm·g(h₂ − h₁) = −ρΔV·g(h₂ − h₁)"],
  ["Change in kinetic energy", "Only the end slices differ; the middle is unchanged in steady flow:", "ΔK = ½Δm(v₂² − v₁²) = ½ρΔV(v₂² − v₁²)"],
  ["Work–energy theorem", "Non-viscous ⇒ no friction work, so W_P + W_g = ΔK:", "(P₁ − P₂)ΔV − ρgΔV(h₂ − h₁) = ½ρΔV(v₂² − v₁²)"],
  ["Divide by ΔV and rearrange", "Group terms belonging to each section:", "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂"],
];

function Derivation() {
  return (
    <>
      <PageHero kicker="Stage 04 · Derivation" title="Deriving Bernoulli's equation.">
        Apply the work–energy theorem to a moving element of ideal fluid in a pipe of varying area and height.
      </PageHero>
      <section className="mx-auto max-w-6xl px-5">
        <Card>
          <h2 className="text-2xl font-semibold">The physical model · a moving fluid element</h2>
          <svg viewBox="0 0 700 260" className="mt-4 w-full">
            <path d="M20 170 L220 170 C330 170 360 70 470 70 L680 70 L680 110 L470 110 C380 110 330 240 220 240 L20 240 Z" fill="color-mix(in oklab, var(--primary) 14%, transparent)" stroke="var(--primary)" strokeWidth="2" />
            <rect x="90" y="170" width="40" height="70" fill="var(--accent)" opacity=".55" />
            <rect x="560" y="70" width="70" height="40" fill="var(--accent)" opacity=".55" />
            <path d="M40 205 H85" stroke="var(--foreground)" strokeWidth="2" markerEnd="url(#a)" />
            <path d="M675 90 H635" stroke="var(--foreground)" strokeWidth="2" markerEnd="url(#a)" />
            <path d="M150 205 H200" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#a)" className="animate-flow" />
            <path d="M600 60 H660" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#a)" />
            <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="var(--foreground)" /></marker></defs>
            <text x="60" y="160" fill="var(--foreground)" fontSize="13">P₁A₁ → , A₁, v₁</text>
            <text x="500" y="55" fill="var(--foreground)" fontSize="13">A₂, v₂ ← P₂A₂</text>
            <line x1="20" y1="255" x2="680" y2="255" stroke="var(--muted-foreground)" strokeDasharray="4 4" />
            <line x1="110" y1="255" x2="110" y2="205" stroke="var(--muted-foreground)" /><text x="116" y="250" fill="var(--muted-foreground)" fontSize="12">h₁</text>
            <line x1="595" y1="255" x2="595" y2="90" stroke="var(--muted-foreground)" /><text x="601" y="180" fill="var(--muted-foreground)" fontSize="12">h₂</text>
            <text x="110" y="232" textAnchor="middle" fill="var(--foreground)" fontSize="11">v₁Δt</text>
            <text x="595" y="125" textAnchor="middle" fill="var(--foreground)" fontSize="11">v₂Δt</text>
          </svg>
        </Card>
        <h2 className="mt-16 text-3xl font-semibold">From pressure work to conserved energy.</h2>
        <ol className="mt-6 space-y-4">
          {STEPS.map(([t, d, e], i) => (
            <li key={t} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <Card className="grid gap-3 md:grid-cols-[60px_1fr]">
                <span className="eq text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div><h3 className="text-xl font-semibold">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p><p className="eq mt-3 overflow-x-auto rounded-lg bg-secondary px-4 py-3 text-primary">{e}</p></div>
              </Card>
            </li>
          ))}
        </ol>
        <Card className="mt-8 border-primary text-center shadow-glow">
          <p className="text-sm text-muted-foreground">Since sections 1 and 2 are arbitrary points along a streamline:</p>
          <p className="eq mt-2 text-2xl md:text-4xl"><span className="text-gradient">P + ½ρv² + ρgh = constant</span></p>
          <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
            <div><h3 className="font-semibold text-primary">Pressure energy density</h3><p className="text-sm text-muted-foreground">P (J/m³)</p></div>
            <div><h3 className="font-semibold text-primary">Kinetic energy density</h3><p className="text-sm text-muted-foreground">½ρv² — the dynamic pressure</p></div>
            <div><h3 className="font-semibold text-primary">Potential energy density</h3><p className="text-sm text-muted-foreground">ρgh — the hydrostatic term</p></div>
          </div>
        </Card>
        <h2 className="mt-16 text-3xl font-semibold">Derivation video</h2>
        <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-border">
          <iframe className="h-full w-full" src="https://www.youtube-nocookie.com/embed/R5uoTadxhpU?rel=0" title="Bernoulli's equation derivation" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
        </div>
        <Card className="mt-8">
          <h3 className="text-lg font-semibold">Further reading used to check the derivation</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li><a className="text-primary underline" href="https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation" target="_blank" rel="noreferrer">OpenStax University Physics Vol. 1 — §14.6 Bernoulli's Equation</a></li>
            <li><a className="text-primary underline" href="http://hyperphysics.phy-astr.gsu.edu/hbase/pber.html" target="_blank" rel="noreferrer">HyperPhysics — Bernoulli Equation</a></li>
            <li>NCERT Physics Class 11, Part 2 — Mechanical Properties of Fluids</li>
          </ul>
        </Card>
      </section>
      <NextLink to="/applications" label="See real-world applications" />
    </>
  );
}
