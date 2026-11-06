import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Card, NextLink, PageHero, meta } from "@/components/SiteLayout";
import { LIMITS, normalizeControls, venturi, type Controls } from "@/lib/venturi";

export const Route = createFileRoute("/venturi")({
  head: () => meta("Interactive Venturi Tube Simulator — Bernoulli's Theorem", "Adjust a Venturi tube and watch flow speed, pressure and manometer levels respond."),
  component: Venturi,
});

const DEFAULTS: Controls = { d1: 10, d2: 5, v1: 1.5, p1: 120, rho: 1000 };

function Slider({ label, unit, value, set, min, max, step, hint }: { label: string; unit: string; value: number; set: (n: number) => void; min: number; max: number; step: number; hint?: string }) {
  const id = useId();
  return <div className="control-group">
    <div className="flex items-center justify-between gap-2 text-sm"><label htmlFor={id} className="text-muted-foreground">{label}</label><output htmlFor={id} className="eq rounded-md bg-secondary px-2 py-1 text-primary">{value} {unit}</output></div>
    <input id={id} type="range" min={min} max={max} step={step} value={value} aria-valuetext={`${value} ${unit}`} onChange={(e)=>set(e.currentTarget.valueAsNumber)} className="control-range mt-2 h-8 w-full cursor-pointer touch-pan-y"/>
    {hint&&<p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </div>;
}

function Venturi() {
  const [c,setC]=useState<Controls>(DEFAULTS);
  const update=(k:keyof Controls)=>(n:number)=>setC(prev=>normalizeControls({...prev,[k]:n},prev));
  const {d1,d2,v1,p1,rho}=c;
  const r=venturi({d1:d1/100,d2:d2/100,v1,p1:p1*1000,rho});
  const cavitate=r.p2<0;
  const throatRatio=d2/d1;
  const tubeTop=100, tubeBottom=220, throatHeight=120*throatRatio;
  const top2=160-throatHeight/2, bottom2=160+throatHeight/2;
  const inletPressure=Math.max(0,Math.min(100,p1/180*100));
  const throatPressure=Math.max(0,Math.min(100,r.p2/(p1*1000)*100));
  const speedRatio=r.v2/v1;
  const flowDuration=Math.max(.22,1.25/Math.max(1,speedRatio));
  return <>
    <PageHero kicker="Stage 03 · Venturi Lab" title="Enter the Venturi Lab.">
      Change the tube geometry and inlet conditions. Watch continuity increase the throat speed, while Bernoulli's equation predicts a pressure drop in this horizontal tube.
    </PageHero>
    <section className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-[minmax(0,1fr)_330px]">
      <Card className="venturi-lab-card overflow-hidden">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div><p className="text-xs uppercase tracking-widest text-accent">Live flow visualisation</p><h2 className="text-xl font-semibold">Pressure and velocity along the tube</h2></div>
          <span className="rounded-full border border-primary/40 bg-secondary px-3 py-1 text-xs text-primary">Horizontal · ideal flow</span>
        </div>
        <svg viewBox="0 0 760 360" className="w-full" role="img" aria-label={`Venturi: inlet speed ${v1.toFixed(2)} metres per second, throat speed ${r.v2.toFixed(2)} metres per second, pressure drop ${(r.dp/1000).toFixed(2)} kilopascals`}>
          <defs>
            <linearGradient id="venturiWater" x1="0" x2="1"><stop offset="0" stopColor="#117cc0"/><stop offset=".48" stopColor="#55dcf1"/><stop offset="1" stopColor="#117cc0"/></linearGradient>
            <linearGradient id="pressureBand" x1="0" x2="1"><stop offset="0" stopColor="#f0b54a"/><stop offset=".5" stopColor="#f06d5c"/><stop offset="1" stopColor="#f0b54a"/></linearGradient>
            <clipPath id="venturiClip"><path d={`M30 ${tubeTop} H190 C285 ${tubeTop} 290 ${top2} 355 ${top2} H405 C470 ${top2} 475 ${tubeTop} 570 ${tubeTop} H730 V${tubeBottom} H570 C475 ${tubeBottom} 470 ${bottom2} 405 ${bottom2} H355 C290 ${bottom2} 285 ${tubeBottom} 190 ${tubeBottom} H30 Z`}/></clipPath>
          </defs>
          {/* Tube shell */}
          <path d={`M30 ${tubeTop} H190 C285 ${tubeTop} 290 ${top2} 355 ${top2} H405 C470 ${top2} 475 ${tubeTop} 570 ${tubeTop} H730 V${tubeBottom} H570 C475 ${tubeBottom} 470 ${bottom2} 405 ${bottom2} H355 C290 ${bottom2} 285 ${tubeBottom} 190 ${tubeBottom} H30 Z`} fill="color-mix(in oklab,var(--primary) 9%,transparent)" stroke="var(--primary)" strokeWidth="5" strokeLinejoin="round"/>
          <g clipPath="url(#venturiClip)">
            <rect x="30" y="92" width="700" height="140" fill="url(#venturiWater)" opacity=".13"/>
            <rect x="30" y="96" width={190} height="8" fill="url(#pressureBand)" opacity={.3+inletPressure/220}/>
            <rect x="300" y={top2} width="155" height={bottom2-top2} fill="#e65f5a" opacity=".12"/>
            {[0,1,2,3,4,5].map(i=><path key={i} d={`M30 ${118+i*18} H190 C285 ${118+i*18} 290 ${160+(i-2.5)*throatHeight/6} 355 ${160+(i-2.5)*throatHeight/6} H405 C470 ${160+(i-2.5)*throatHeight/6} 475 ${118+i*18} 570 ${118+i*18} H730`} fill="none" stroke="#b8f6ff" strokeWidth="2" opacity=".45" strokeDasharray="9 11" className="animate-flow" style={{animationDuration:`${flowDuration}s`}}/>)}
            {[0,1,2,3,4].map(i=><circle key={i} r="5" fill="#f4fdff" stroke="#1aa8d5" strokeWidth="2" className="venturi-particle"><animateMotion dur={`${3.3/Math.max(1,speedRatio)}s`} repeatCount="indefinite" begin={`${i*.5}s`} path={`M35 160 H190 C285 160 290 160 355 160 H405 C470 160 475 160 570 160 H725`}/></circle>)}
          </g>
          {/* manometer taps and columns */}
          <path d="M130 100 V48 Q130 34 144 34 H184 Q198 34 198 48 V100" fill="none" stroke="var(--muted-foreground)" strokeWidth="7" strokeLinecap="round"/>
          <path d="M130 100 V48 Q130 34 144 34 H184 Q198 34 198 48 V100" fill="none" stroke="#79dff1" strokeWidth="3" strokeLinecap="round"/>
          <path d={`M374 ${top2} V48 Q374 34 388 34 H428 Q442 34 442 48 V${top2}`} fill="none" stroke="var(--muted-foreground)" strokeWidth="7" strokeLinecap="round"/>
          <path d={`M374 ${top2} V48 Q374 34 388 34 H428 Q442 34 442 48 V${top2}`} fill="none" stroke="#79dff1" strokeWidth="3" strokeLinecap="round"/>
          <rect x="140" y={100-inletPressure*.48} width="48" height={inletPressure*.48} rx="4" fill="#23b6e0" opacity=".85" style={{transition:"all .35s"}}/>
          <rect x="384" y={top2-throatPressure*.48} width="48" height={throatPressure*.48} rx="4" fill="#f4b84f" opacity=".9" style={{transition:"all .35s"}}/>
          <text x="165" y="20" textAnchor="middle" fill="var(--foreground)" fontSize="13" fontWeight="600">P₁</text>
          <text x="408" y="20" textAnchor="middle" fill="var(--foreground)" fontSize="13" fontWeight="600">P₂</text>
          <text x="105" y="265" fill="var(--foreground)" fontSize="14" fontWeight="600">INLET</text>
          <text x="380" y={bottom2+42} textAnchor="middle" fill="var(--accent)" fontSize="14" fontWeight="700">THROAT</text>
          <text x="620" y="265" fill="var(--foreground)" fontSize="14" fontWeight="600">OUTLET</text>
          <text x="105" y="285" fill="var(--muted-foreground)" fontSize="12">Area A₁</text>
          <text x="380" y={bottom2+60} textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">Area A₂</text>
          <text x="620" y="285" fill="var(--muted-foreground)" fontSize="12">Area A₁</text>
          <path d="M80 310 H260" stroke="#26c5e7" strokeWidth="3" strokeLinecap="round"/><path d="M260 310 l-12 -7 v14z" fill="#26c5e7"/>
          <text x="170" y="333" textAnchor="middle" fill="var(--foreground)" fontSize="12">Flow direction</text>
          <text x="540" y="333" textAnchor="middle" fill="var(--accent)" fontSize="12">v₂ / v₁ = {speedRatio.toFixed(2)}</text>
        </svg>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Throat speed v₂",`${r.v2.toFixed(2)} m/s`],
            ["Throat pressure P₂",`${(r.p2/1000).toFixed(2)} kPa`],
            ["Pressure drop ΔP",`${(r.dp/1000).toFixed(2)} kPa`],
            ["Volume flow Q",`${(r.q*1000).toFixed(2)} L/s`],
          ].map(([label,value])=><div key={label} className="metric-tile rounded-xl border border-border bg-secondary/60 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="eq mt-1 text-lg text-primary">{value}</p></div>)}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">At the throat the area is smaller, so continuity raises speed. In a horizontal ideal flow, Bernoulli's equation then predicts lower static pressure.</p>
        {cavitate&&<p role="alert" className="mt-4 rounded-lg border border-destructive p-3 text-sm text-destructive">The ideal calculation gives a negative gauge pressure at the throat. Real liquid can cavitate before this ideal condition is reached; reduce inlet speed or widen the throat.</p>}
        <p className="mt-3 text-xs text-muted-foreground">Model assumptions: steady, incompressible, negligible-viscosity flow in a horizontal tube. Manometer levels are a visual indicator; gauge pressures are used in the calculation.</p>
      </Card>
      <Card className="venturi-controls space-y-5">
        <div className="flex items-center justify-between gap-2"><div><p className="text-xs uppercase tracking-widest text-accent">Experiment panel</p><h2 className="text-xl font-semibold">Control the flow</h2></div>
          <button onClick={()=>setC(DEFAULTS)} className="rounded-lg border border-border px-3 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-glow active:scale-95">↺ Reset</button>
        </div>
        <Slider label="Inlet diameter d₁" unit="cm" value={d1} set={update("d1")} {...LIMITS.d1}/>
        <Slider label="Throat diameter d₂" unit="cm" value={d2} set={update("d2")} min={LIMITS.d2.min} max={d1} step={LIMITS.d2.step} hint={`Limited to inlet diameter (${d1} cm)`}/>
        <Slider label="Inlet speed v₁" unit="m/s" value={v1} set={update("v1")} {...LIMITS.v1}/>
        <Slider label="Inlet pressure P₁" unit="kPa" value={p1} set={update("p1")} {...LIMITS.p1}/>
        <Slider label="Fluid density ρ" unit="kg/m³" value={rho} set={update("rho")} {...LIMITS.rho}/>
        <div className="rounded-xl border border-primary/25 bg-secondary/60 p-4"><p className="text-sm font-semibold text-primary">Physics used by the model</p><p className="eq mt-2 text-sm leading-7">A₁v₁ = A₂v₂<br/>P₁ + ½ρv₁² = P₂ + ½ρv₂²</p></div>
        <div className="rounded-xl bg-secondary/40 p-4 text-sm"><p className="font-semibold">What changed?</p><p className="mt-1 text-muted-foreground">{r.v2>v1+.01?`The throat speed is ${(r.v2/v1).toFixed(2)} times the inlet speed. Pressure falls by ${(r.dp/1000).toFixed(2)} kPa.`:"The inlet and throat areas are equal, so the ideal model predicts no speed or pressure change."}</p></div>
      </Card>
    </section>
    <NextLink to="/derivation" label="Derive the equation"/>
  </>;
}
