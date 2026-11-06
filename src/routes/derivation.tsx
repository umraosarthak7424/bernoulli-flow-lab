import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/derivation")({
  head: () => meta("Deriving Bernoulli's Equation — Step by Step", "Reveal a rigorous work-energy derivation of Bernoulli's equation one step at a time."),
  component: Derivation,
});

const STEPS: [string, string, string][] = [
  ["Continuity", "In time Δt the same volume ΔV passes both ends of the element (incompressible):", "ΔV = A₁v₁Δt = A₂v₂Δt"],
  ["Work by pressure", "Pressure at end 1 pushes forward (+), pressure at end 2 resists (−):", "Wₚ = P₁A₁(v₁Δt) − P₂A₂(v₂Δt) = (P₁ − P₂)ΔV"],
  ["Work by gravity", "The mass Δm = ρΔV effectively moves from height h₁ to h₂:", "Wg = −Δm·g(h₂ − h₁) = −ρΔV·g(h₂ − h₁)"],
  ["Change in kinetic energy", "Only the end slices differ; the middle is unchanged in steady flow:", "ΔK = ½Δm(v₂² − v₁²) = ½ρΔV(v₂² − v₁²)"],
  ["Work–energy theorem", "For non-viscous flow, pressure work plus gravitational work equals the kinetic-energy change:", "(P₁ − P₂)ΔV − ρgΔV(h₂ − h₁) = ½ρΔV(v₂² − v₁²)"],
  ["Divide by ΔV and rearrange", "Divide through by the displaced volume and collect the terms at each section:", "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂"],
];

function AnimatedFluidModel() {
  const centreline = "M38 150 H174 C255 150 266 98 350 98 H722";
  const tube = "M36 92 H174 C255 92 266 76 350 76 H724 V120 H350 C266 120 255 202 174 202 H36 Z";
  return (
    <Card className="derivation-model overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Animated flow model</p>
          <h2 className="mt-1 text-xl font-semibold md:text-2xl">A fluid element moves through a changing pipe</h2>
        </div>
        <span className="rounded-full border border-primary/30 bg-secondary px-3 py-1 text-xs text-primary">Steady flow</span>
      </div>
      <svg viewBox="0 0 760 310" className="mt-4 w-full" role="img" aria-label="Animated fluid moving through a pipe that narrows and rises; speed increases and pressure decreases at the throat">
        <defs>
          <linearGradient id="modelWater" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#126eaa" />
            <stop offset=".55" stopColor="#26c5e7" />
            <stop offset="1" stopColor="#126eaa" />
          </linearGradient>
          <linearGradient id="fluidSlug" x1="0" x2="1">
            <stop offset="0" stopColor="#ffd16d" stopOpacity=".18" />
            <stop offset=".5" stopColor="#ffd16d" stopOpacity=".62" />
            <stop offset="1" stopColor="#ffd16d" stopOpacity=".18" />
          </linearGradient>
          <clipPath id="modelPipeClip"><path d={tube} /></clipPath>
          <marker id="modelArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#25c9e8" />
          </marker>
        </defs>

        <path d={tube} fill="color-mix(in oklab,var(--primary) 8%,var(--card))" stroke="#1b8dac" strokeWidth="4" strokeLinejoin="round" />
        <g clipPath="url(#modelPipeClip)">
          <rect x="32" y="72" width="700" height="140" fill="url(#modelWater)" opacity=".16" />
          {[0,1,2,3,4,5].map((i) => (
            <path key={i} d={centreline} fill="none" stroke="#9af2ff" strokeWidth="2" strokeDasharray="8 16" opacity=".58"
              className="model-flow-line" style={{ animationDelay: `${i * -.34}s` }} />
          ))}
          {[0,1,2,3,4].map((i) => (
            <circle key={i} r={i === 2 ? 6 : 4.5} fill="#e9fdff" stroke="#1499bf" strokeWidth="2" filter="drop-shadow(0 0 4px #58eaff)">
              <animateMotion path={centreline} dur="4.8s" begin={`${i * -.82}s`} repeatCount="indefinite" rotate="auto" />
            </circle>
          ))}
          <rect x="-17" y="-14" width="34" height="28" rx="5" fill="url(#fluidSlug)" stroke="#ffe29b" strokeWidth="2" strokeDasharray="4 3">
            <animateMotion path={centreline} dur="5.2s" repeatCount="indefinite" rotate="auto" />
          </rect>
        </g>

        {/* Section markers and pressure/velocity arrows. */}
        <path d="M133 92 V202" stroke="#f7c66b" strokeWidth="3" strokeDasharray="5 5" />
        <path d="M387 76 V120" stroke="#f7c66b" strokeWidth="3" strokeDasharray="4 4" />
        <text x="133" y="230" textAnchor="middle" fill="var(--foreground)" fontSize="14" fontWeight="700">Section 1 · A₁</text>
        <text x="387" y="147" textAnchor="middle" fill="#ffd16d" fontSize="13" fontWeight="700">Throat · A₂</text>
        <path d="M78 56 H128" stroke="#25c9e8" strokeWidth="4" markerEnd="url(#modelArrow)" />
        <text x="78" y="43" fill="var(--foreground)" fontSize="13">v₁ · slower</text>
        <path d="M350 48 H445" stroke="#25c9e8" strokeWidth="5" markerEnd="url(#modelArrow)" />
        <text x="350" y="35" fill="var(--foreground)" fontSize="13">v₂ · faster</text>
        <text x="133" y="260" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">Higher pressure P₁</text>
        <text x="387" y="173" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">Lower pressure P₂</text>

        {/* Elevation reference. */}
        <path d="M35 282 H724" stroke="var(--muted-foreground)" strokeOpacity=".6" strokeDasharray="5 6" />
        <path d="M133 282 V150 M387 282 V98" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeDasharray="4 5" />
        <text x="143" y="278" fill="var(--accent)" fontSize="13">h₁</text>
        <text x="397" y="278" fill="var(--accent)" fontSize="13">h₂</text>
        <text x="575" y="154" fill="var(--muted-foreground)" fontSize="12">Moving fluid element</text>
        <path d="M570 160 L535 160" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-secondary/70 p-3"><p className="font-semibold text-primary">Wide section</p><p className="text-muted-foreground">Larger area, lower speed, higher pressure.</p></div>
        <div className="rounded-xl bg-secondary/70 p-3"><p className="font-semibold text-primary">Narrow throat</p><p className="text-muted-foreground">Smaller area, higher speed, lower pressure.</p></div>
        <div className="rounded-xl bg-secondary/70 p-3"><p className="font-semibold text-primary">Rising pipe</p><p className="text-muted-foreground">Greater height contributes gravitational potential energy.</p></div>
      </div>
    </Card>
  );
}

function Derivation() {
  const [revealed, setRevealed] = useState(0);
  return (
    <>
      <PageHero kicker="Stage 04 · Derivation" title="Discover Bernoulli's equation.">
        Follow the work–energy argument. Reveal one step at a time; the next control stays beside the step you are reading.
      </PageHero>
      <section className="mx-auto max-w-6xl space-y-6 px-5">
        <AnimatedFluidModel />

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/40 bg-secondary/50 p-4">
          <div className="min-w-28">
            <p className="text-sm text-muted-foreground">Derivation progress</p>
            <p className="font-semibold">{revealed === 0 ? "Ready to begin" : `Step ${revealed} of 6`}</p>
          </div>
          <div className="h-2 min-w-32 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(revealed / 6) * 100}%` }} />
          </div>
        </div>

        {revealed === 0 ? (
          <Card className="border-primary/40 text-center">
            <p className="text-muted-foreground">Ready to build Bernoulli's equation from conservation of energy?</p>
            <button type="button" className="primary-action mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
              onClick={() => setRevealed(1)}>Reveal the Derivation →</button>
          </Card>
        ) : (
          <ol className="space-y-4">
            {STEPS.slice(0, revealed).map(([title, description, equation], i) => (
              <li key={title} className="reveal-step">
                <Card className="grid gap-3 md:grid-cols-[64px_1fr]">
                  <span className="eq text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="mt-1 text-muted-foreground">{description}</p>
                    <p className="eq mt-3 overflow-x-auto rounded-xl bg-secondary px-4 py-3 text-primary">{equation}</p>
                    {i === revealed - 1 && revealed < 6 && (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground">Step {revealed} complete</span>
                        <button type="button" className="primary-action rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
                          onClick={() => setRevealed((n) => Math.min(6, n + 1))}>Reveal Step {revealed + 1} →</button>
                      </div>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        )}

        {revealed === 6 && (
          <Card className="border-primary text-center shadow-glow animate-popin">
            <p className="text-sm text-muted-foreground">Since points 1 and 2 are arbitrary points along a streamline:</p>
            <p className="eq mt-2 text-2xl md:text-4xl"><span className="text-gradient">P + ½ρv² + ρgh = constant</span></p>
            <p className="mt-3 text-muted-foreground">Pressure energy density + kinetic energy density + gravitational potential energy density is conserved along the streamline.</p>
            <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
              <div><h3 className="font-semibold text-primary">Pressure energy density</h3><p className="text-sm text-muted-foreground">P (J/m³)</p></div>
              <div><h3 className="font-semibold text-primary">Kinetic energy density</h3><p className="text-sm text-muted-foreground">½ρv² (J/m³)</p></div>
              <div><h3 className="font-semibold text-primary">Potential energy density</h3><p className="text-sm text-muted-foreground">ρgh (J/m³)</p></div>
            </div>
            <button type="button" className="secondary-action mt-6 rounded-xl border border-primary/40 px-5 py-2.5 font-semibold text-primary"
              onClick={() => setRevealed(0)}>Start the derivation again ↺</button>
          </Card>
        )}
      </section>
      <NextLink to="/applications" label="See real-world applications" />
    </>
  );
}
