import { useMemo, useState } from "react";
import { MAX_ENERGY, starsFor } from "@/lib/game/engine";
import { play } from "@/lib/game/audio";
import { LEVELS, flooded, isSolved, openings, rotate, scramble, type Tile } from "@/lib/game/pipes";
import { GameButton, MissionTop, OutOfEnergy, Panel, Pip, type MissionProps } from "./ui";

const END: Record<number, [number, number]> = { 0: [50, 0], 1: [100, 50], 2: [50, 100], 3: [0, 50] };

function TileSvg({ t, wet }: { t: Tile; wet: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {openings(t).map((d) => (
        <g key={d}>
          <line x1="50" y1="50" x2={END[d]![0]} y2={END[d]![1]} stroke="var(--ink)" strokeWidth="30" strokeLinecap="round" />
          <line x1="50" y1="50" x2={END[d]![0]} y2={END[d]![1]} stroke={wet ? "var(--sky-deep)" : "var(--cloud)"} strokeWidth="18" strokeLinecap="round" className="transition-colors duration-300" />
        </g>
      ))}
    </svg>
  );
}

export function PipeMaze({ onDone, onExit }: MissionProps) {
  const [li, setLi] = useState(0);
  const lvl = LEVELS[li]!;
  const [tiles, setTiles] = useState(() => scramble(LEVELS[0]!));
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(0);
  const wet = useMemo(() => flooded(lvl, tiles), [lvl, tiles]);
  const solved = isSolved(lvl, tiles);

  const reset = () => { setLi(0); setTiles(scramble(LEVELS[0]!)); setEnergy(MAX_ENERGY); setMistakes(0); setWrong([]); setAnswered(false); setXp(0); };
  if (energy <= 0) return <OutOfEnergy onRetry={reset} onExit={onExit} />;

  const tap = (r: number, c: number) => {
    if (solved) return;
    play("click");
    const n = rotate(tiles, r, c);
    setTiles(n);
    if (isSolved(lvl, n)) setTimeout(() => play("sparkle"), 150);
  };
  const answer = (j: number) => {
    if (answered || wrong.includes(j)) return;
    if (j === lvl.q.a) { play("correct"); setAnswered(true); setXp((x) => x + 30); }
    else { play("wrong"); setWrong((w) => [...w, j]); setMistakes((m) => m + 1); setEnergy((e) => e - 1); }
  };
  const next = () => {
    if (li + 1 >= LEVELS.length) { onDone(starsFor(mistakes), xp, mistakes); return; }
    const n = li + 1;
    setLi(n); setTiles(scramble(LEVELS[n]!)); setWrong([]); setAnswered(false);
  };

  return (
    <div>
      <MissionTop title="Pipe Maze" step={li + 1} total={LEVELS.length} energy={energy} onExit={onExit} />
      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <Panel className="mx-auto w-full max-w-md">
          <p className="mb-2 text-sm font-semibold">Tap pipes to rotate. Connect 💧 to 🏙️</p>
          <div className="flex items-stretch gap-1">
            <div className="flex flex-col justify-around text-xl" style={{ display: "grid", gridTemplateRows: `repeat(${lvl.rows}, 1fr)` }}>
              {Array.from({ length: lvl.rows }, (_, r) => <span key={r} className="flex items-center">{r === lvl.inRow ? "💧" : ""}</span>)}
            </div>
            <div className="grid flex-1 gap-0.5 rounded-xl bg-leaf/40 p-1" style={{ gridTemplateColumns: `repeat(${lvl.cols}, 1fr)` }}>
              {tiles.map((row, r) => row.map((t, c) => (
                <button key={`${r}-${c}`} onClick={() => tap(r, c)} aria-label={`Rotate pipe row ${r + 1} column ${c + 1}`} className="aspect-square rounded-md bg-sun/30 transition-transform hover:scale-105">
                  <TileSvg t={t} wet={wet.has(`${r},${c}`)} />
                </button>
              )))}
            </div>
            <div className="text-xl" style={{ display: "grid", gridTemplateRows: `repeat(${lvl.rows}, 1fr)` }}>
              {Array.from({ length: lvl.rows }, (_, r) => <span key={r} className="flex items-center">{r === lvl.outRow ? "🏙️" : ""}</span>)}
            </div>
          </div>
        </Panel>
        <Panel>
          {!solved ? (
            <Pip>Water flows through connected pipes. In a real pipe the same volume passes every section each second: <b className="eq">Q = A·v</b>.</Pip>
          ) : (
            <div className="animate-popin">
              <p className="font-display text-xl font-semibold">Water reached the city! Now the valve check:</p>
              <h3 className="mt-2 text-lg">{lvl.q.text}</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {lvl.q.options.map((o, j) => (
                  <button key={j} onClick={() => answer(j)} className={`rounded-2xl border-4 border-ink px-3 py-2 font-semibold ${answered && j === lvl.q.a ? "bg-leaf" : wrong.includes(j) ? "bg-coral/60 line-through" : "bg-sun/60 hover:scale-105"}`}>{o}</button>
                ))}
              </div>
              {answered && (
                <div className="mt-4 space-y-3">
                  <Pip>{lvl.q.why}</Pip>
                  <GameButton tone="leaf" onClick={next}>{li + 1 >= LEVELS.length ? "Finish mission ★" : "Next maze →"}</GameButton>
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
