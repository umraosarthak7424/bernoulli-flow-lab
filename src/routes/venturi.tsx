import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";
import { LIMITS, normalizeControls, venturi, type Controls } from "@/lib/venturi";

export const Route = createFileRoute("/venturi")({
  head: () => meta("Interactive Venturi Tube Simulator — Bernoulli's Theorem", "Adjust pipe diameters, inlet speed and pressure to see Bernoulli's principle in a live Venturi tube."),
  component: Venturi,
});

function Slider({ label, unit, value, set, min, max, step, hint }: { label: string; unit: string; value: number; set: (n: number) => void; min: number; max: number; step: number; hint?: string }) {
  const id = useId();
  return (
    <div>
      <div className="flex justify-between text-sm">
        <label htmlFor={id} className="text-muted-foreground">{label}</label>
        <output htmlFor={id} className="eq">{value} {unit}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value} ${unit}`}
        onChange={(e) => set(e.currentTarget.valueAsNumber)}
        className="mt-1 h-8 w-full cursor-pointer touch-pan-y accent-primary"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Venturi() {
  const [c, setC] = useState<Controls>({ d1: 10, d2: 5, v1: 1.5, p1: 120, rho: 1000 });
  const update = (k: keyof Controls) => (n: number) => setC((prev) => normalizeControls({ ...prev, [k]: n }, prev));
  const { d1, d2, v1, p1, rho } = c;
  const r = venturi({ d1: d1 / 100, d2: d2 / 100, v1, p1: p1 * 1000, rho });
  const cavitate = r.p2 < 0;
  const H1 = 100;
  const H2 = Math.max(2, (H1 * d2) / d1);
  const top2 = 110 - H2 / 2, bot2 = 110 + H2 / 2;
  const col1 = Math.min(150, p1 / 1.2);
  const col2 = Math.max(0, Math.min(150, r.p2 / 1000 / 1.2));
  const speed = Math.max(0.15, 2 / v1);
  const lines = [-0.35, 0, 0.35];


  return (
    <>
      <PageHero kicker="Stage 03 · Venturi Lab" title="Enter the Venturi Lab.">
        A horizontal tube narrows to a throat. Continuity gives the throat speed; Bernoulli gives the throat pressure. The manometer columns show the pressure at each section.
      </PageHero>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <svg viewBox="0 -110 700 330" className="w-full" role="img" aria-label={`Venturi tube: inlet ${d1} cm, throat ${d2} cm, throat speed ${r.v2.toFixed(2)} m/s, throat pressure ${(r.p2 / 1000).toFixed(2)} kPa`}>
            {/* manometers */}
            {[{ x: 120, h: col1, c: "var(--primary)" }, { x: 350, h: col2, c: "var(--accent)" }].map((m, i) => (
              <g key={i}>
                <rect x={m.x - 8} y={(i ? top2 : 60) - 160} width="16" height="160" rx="3" fill="none" stroke="var(--border)" />
                <rect x={m.x - 6} y={(i ? top2 : 60) - m.h} width="12" height={m.h} fill={m.c} opacity=".85" style={{ transition: "all .4s" }} />
              </g>
            ))}
            <path d={`M10 60 L200 60 C270 60 280 ${top2} 330 ${top2} L370 ${top2} C450 ${top2} 520 60 690 60 L690 160 C520 160 450 ${bot2} 370 ${bot2} L330 ${bot2} C280 ${bot2} 270 160 200 160 L10 160 Z`} fill="color-mix(in oklab, var(--primary) 15%, transparent)" stroke="var(--primary)" strokeWidth="2" />
            {lines.map((f) => {
              const y1 = 110 + f * H1, y2 = 110 + f * H2;
              return <path key={f} d={`M10 ${y1} L200 ${y1} C270 ${y1} 280 ${y2} 330 ${y2} L370 ${y2} C450 ${y2} 520 ${y1} 690 ${y1}`} fill="none" stroke="var(--foreground)" strokeOpacity=".7" strokeWidth="1.5" className="animate-flow" style={{ animationDuration: `${speed}s` }} />;
            })}
            <text x="120" y="190" textAnchor="middle" fill="var(--foreground)" fontSize="13">Section 1</text>
            <text x="350" y={bot2 + 30} textAnchor="middle" fill="var(--foreground)" fontSize="13">Throat 2</text>
          </svg>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["v₂", `${r.v2.toFixed(2)} m/s`],
              ["P₂", `${(r.p2 / 1000).toFixed(2)} kPa`],
              ["ΔP = P₁ − P₂", `${(r.dp / 1000).toFixed(2)} kPa`],
              ["Q = A₁v₁", `${(r.q * 1000).toFixed(2)} L/s`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="eq text-lg text-primary">{v}</p></div>
            ))}
          </div>
          {cavitate && <p role="alert" className="mt-4 rounded-lg border border-destructive p-3 text-sm text-destructive">The ideal Bernoulli formula gives a negative throat pressure here, which cannot happen physically. Real liquid would cavitate (vaporise) before reaching this point, so the throat manometer is shown empty. Lower v₁ or widen the throat.</p>}
          <p className="mt-3 text-xs text-muted-foreground">Assumptions: ideal, incompressible, steady, non-viscous flow in a horizontal tube; P is gauge pressure.</p>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Controls</h2>
          <Slider label="Inlet diameter d₁" unit="cm" value={d1} set={update("d1")} {...LIMITS.d1} />
          <Slider label="Throat diameter d₂" unit="cm" value={d2} set={update("d2")} min={LIMITS.d2.min} max={d1} step={LIMITS.d2.step} hint={`Range 1 cm – d₁ (${d1} cm)`} />
          <Slider label="Inlet speed v₁" unit="m/s" value={v1} set={update("v1")} {...LIMITS.v1} />
          <Slider label="Inlet pressure P₁" unit="kPa" value={p1} set={update("p1")} {...LIMITS.p1} />
          <Slider label="Density ρ" unit="kg/m³" value={rho} set={update("rho")} {...LIMITS.rho} />
          <div className="eq rounded-lg bg-secondary p-3 text-xs leading-6 text-muted-foreground">
            v₂ = v₁·(d₁/d₂)²<br />P₂ = P₁ + ½ρ(v₁² − v₂²)
          </div>
        </Card>
      </section>
      <NextLink to="/derivation" label="Derive the equation" />
    </>
  );
}
