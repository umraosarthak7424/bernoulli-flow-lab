import { useState } from "react";
import { MAX_ENERGY, starsFor } from "@/lib/game/engine";
import { play } from "@/lib/game/audio";
import { BLASTER_LIMITS, G, NOZZLE_HEIGHT, ZOMBIES, blaster, shotResult } from "@/lib/game/physics";
import { GameButton, MissionTop, OutOfEnergy, Panel, Pip, type MissionProps } from "./ui";

const W = 640, H = 260, MAXX = 10; // metres shown
const sx = (x: number) => 40 + (x / MAXX) * (W - 60);
const sy = (y: number) => H - 30 - (y / 1.4) * (H - 60);

export function WaterGun({ onDone, onExit }: MissionProps) {
  const [dp, setDp] = useState(60);
  const [d, setD] = useState(4);
  const [supply, setSupply] = useState(10);
  const [zi, setZi] = useState(0);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [misses, setMisses] = useState(0);
  const [shot, setShot] = useState<{ path: string; result: string; key: number } | null>(null);
  const [xp, setXp] = useState(0);
  const z = ZOMBIES[zi]!;
  const r = blaster({ dpKpa: dp, dMm: d, supplyLpm: supply });

  const reset = () => { setZi(0); setEnergy(MAX_ENERGY); setMisses(0); setShot(null); setXp(0); };
  if (energy <= 0) return <OutOfEnergy onRetry={reset} onExit={onExit} />;

  const fire = () => {
    play("splash");
    const pts: string[] = [];
    const end = Math.min(r.range, MAXX);
    for (let k = 0; k <= 30; k++) {
      const x = (end * k) / 30;
      const y = r.v > 0 ? NOZZLE_HEIGHT - (G * x * x) / (2 * r.v * r.v) : 0;
      pts.push(`${k ? "L" : "M"}${sx(x).toFixed(1)},${sy(Math.max(0, y)).toFixed(1)}`);
    }
    const res = shotResult(r, z);
    setShot({ path: pts.join(" "), result: res, key: Date.now() });
    if (res === "hit") { setTimeout(() => play("zombie"), 500); setXp((v) => v + 25); }
    else { setMisses((m) => m + 1); setEnergy((e) => e - 1); setTimeout(() => play("wrong"), 500); }
  };
  const next = () => {
    if (zi + 1 >= ZOMBIES.length) { onDone(starsFor(misses), xp, misses); return; }
    setZi(zi + 1); setShot(null);
  };

  const msg: Record<string, string> = {
    hit: z.quip,
    short: "Too short! More ΔP gives a faster jet (v = √(2ΔP/ρ)) — if the pump can keep up.",
    long: "Overshot! Lower the pressure a little.",
    weak: `Splashed, but too little water! ${z.name} needs at least ${z.minFlow} L/min. A wider nozzle carries more flow (Q = A·v).`,
  };

  return (
    <div>
      <MissionTop title="Water Gun Battle" step={zi + 1} total={ZOMBIES.length} energy={energy} onExit={onExit} />
      <Panel>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl bg-sky/30" role="img" aria-label={`Blaster aimed at ${z.name}, ${z.dist} metres away`}>
          <rect x="0" y={H - 30} width={W} height="30" fill="var(--leaf)" />
          {[0, 2, 4, 6, 8, 10].map((m) => <text key={m} x={sx(m)} y={H - 10} fontSize="12" textAnchor="middle" fill="var(--ink)">{m} m</text>)}
          <rect x="16" y={sy(NOZZLE_HEIGHT) - 8} width="34" height="16" rx="6" fill="var(--coral)" stroke="var(--ink)" strokeWidth="3" />
          <rect x="22" y={sy(NOZZLE_HEIGHT)} width="8" height={H - 30 - sy(NOZZLE_HEIGHT)} fill="var(--ink)" />
          <g transform={`translate(${sx(z.dist)},${H - 30})`} className={shot?.result === "hit" ? "opacity-40 transition-opacity duration-700" : ""}>
            <rect x="-14" y="-62" width="28" height="44" rx="10" fill="var(--leaf)" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="0" cy="-74" r="16" fill="var(--leaf)" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="-6" cy="-77" r="3" fill="var(--ink)" /><circle cx="6" cy="-77" r="3" fill="var(--ink)" />
            <path d="M-6 -66 q6 5 12 0" stroke="var(--ink)" strokeWidth="2" fill="none" />
            <text y="-96" fontSize="12" textAnchor="middle" fill="var(--ink)" fontWeight="bold">{z.name}</text>
            <rect x="-16" y="-18" width="8" height="18" fill="var(--ink)" /><rect x="8" y="-18" width="8" height="18" fill="var(--ink)" />
          </g>
          {shot && (
            <path key={shot.key} d={shot.path} fill="none" stroke="var(--sky-deep)" strokeWidth={Math.max(3, Math.min(10, r.qLpm / 2))} strokeLinecap="round"
              strokeDasharray="1200" strokeDashoffset="1200" style={{ animation: "wg-shoot .6s ease-out forwards" }} />
          )}
          <style>{"@keyframes wg-shoot { to { stroke-dashoffset: 0; } }"}</style>
        </svg>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Slider label="Pressure ΔP" unit="kPa" v={dp} set={setDp} lim={BLASTER_LIMITS.dp} />
          <Slider label="Nozzle diameter" unit="mm" v={d} set={setD} lim={BLASTER_LIMITS.d} />
          <Slider label="Pump supply" unit="L/min" v={supply} set={setSupply} lim={BLASTER_LIMITS.supply} />
        </div>
        <div className="eq mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <Stat k="Ideal speed" v={`${r.vIdeal.toFixed(1)} m/s`} />
          <Stat k="Actual speed" v={`${r.v.toFixed(1)} m/s`} />
          <Stat k="Flow" v={`${r.qLpm.toFixed(1)} L/min`} />
          <Stat k="Range" v={`${r.range.toFixed(2)} m`} />
        </div>
        {r.supplyLimited && <p className="mt-2 text-sm font-semibold text-coral">⚠ Pump can't keep up ({r.demandLpm.toFixed(1)} L/min needed) — the jet is slower than ideal.</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {shot?.result === "hit"
            ? <GameButton tone="leaf" onClick={next}>{zi + 1 >= ZOMBIES.length ? "Finish mission ★" : "Next zombie →"}</GameButton>
            : <GameButton tone="coral" onClick={fire}>💦 Fire!</GameButton>}
          <span className="text-sm">Target: {z.dist} m{z.minFlow ? ` · needs ≥ ${z.minFlow} L/min` : ""} (±0.8 m)</span>
        </div>
        <div className="mt-4">
          <Pip>{shot ? msg[shot.result] : "Simplified model: horizontal shot from 1 m, no air drag. Speed comes from ΔP; flow from nozzle area × speed."}</Pip>
        </div>
      </Panel>
    </div>
  );
}

function Slider({ label, unit, v, set, lim }: { label: string; unit: string; v: number; set: (n: number) => void; lim: { min: number; max: number; step: number } }) {
  return (
    <label className="block rounded-2xl border-2 border-ink bg-sun/30 p-3 text-sm font-semibold">
      <span className="flex justify-between">{label}<span className="eq">{v} {unit}</span></span>
      <input type="range" className="mt-2 w-full accent-[var(--sky-deep)]" min={lim.min} max={lim.max} step={lim.step} value={v} onChange={(e) => set(Number(e.target.value))} />
    </label>
  );
}
function Stat({ k, v }: { k: string; v: string }) {
  return <div className="rounded-xl border-2 border-ink bg-cloud p-2"><div className="text-xs opacity-70">{k}</div><div className="font-semibold">{v}</div></div>;
}
