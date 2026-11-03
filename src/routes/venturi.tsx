import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";
import { venturi } from "@/lib/venturi";

export const Route = createFileRoute("/venturi")({
  head: () => meta("Interactive Venturi Tube Simulator — Bernoulli's Theorem", "Adjust pipe diameters, inlet speed and pressure to see Bernoulli's principle in a live Venturi tube."),
  component: Venturi,
});

function Slider({ label, unit, value, set, min, max, step }: { label: string; unit: string; value: number; set: (n: number) => void; min: number; max: number; step: number }) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="eq">{value} {unit}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className="mt-1 w-full accent-primary" />
    </label>
  );
}

function Venturi() {
  const [d1, setD1] = useState(10);
  const [d2, setD2] = useState(5);
  const [v1, setV1] = useState(1.5);
  const [p1, setP1] = useState(120);
  const [rho, setRho] = useState(1000);
  const r = venturi({ d1: d1 / 100, d2: Math.min(d2, d1) / 100, v1, p1: p1 * 1000, rho });
  const cavitate = r.p2 < 0;
  const H1 = 100;
  const H2 = (H1 * Math.min(d2, d1)) / d1;
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
          <svg viewBox="0 0 700 260" className="w-full">
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
          {cavitate && <p className="mt-4 rounded-lg border border-destructive p-3 text-sm text-destructive">Calculated throat pressure is negative — not physical. In reality the liquid would cavitate (vaporise) before this point.</p>}
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Controls</h2>
          <Slider label="Inlet diameter d₁" unit="cm" value={d1} set={setD1} min={4} max={20} step={0.5} />
          <Slider label="Throat diameter d₂" unit="cm" value={Math.min(d2, d1)} set={setD2} min={1} max={20} step={0.5} />
          <Slider label="Inlet speed v₁" unit="m/s" value={v1} set={setV1} min={0.2} max={5} step={0.1} />
          <Slider label="Inlet pressure P₁" unit="kPa" value={p1} set={setP1} min={20} max={180} step={1} />
          <Slider label="Density ρ" unit="kg/m³" value={rho} set={setRho} min={1} max={1500} step={1} />
          <div className="eq rounded-lg bg-secondary p-3 text-xs leading-6 text-muted-foreground">
            v₂ = v₁·(d₁/d₂)²<br />P₂ = P₁ + ½ρ(v₁² − v₂²)
          </div>
        </Card>
      </section>
      <NextLink to="/derivation" label="Derive the equation" />
    </>
  );
}
