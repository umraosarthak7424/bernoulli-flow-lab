import { useState } from "react";
import { MAX_ENERGY, answerXp, starsFor } from "@/lib/game/engine";
import { play } from "@/lib/game/audio";
import type { Q } from "@/lib/game/questions";
import { GameButton, MissionTop, OutOfEnergy, Panel, Pip, type MissionProps } from "./ui";

/** Shared question loop used by Bubble Burst (floating bubbles) and Skyship Rescue (altitude meter). */
export function QuizMission({ title, rounds, variant, onDone, onExit }: MissionProps & { title: string; rounds: Q[]; variant: "bubble" | "skyship" }) {
  const [i, setI] = useState(0);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const r = rounds[i]!;

  const reset = () => { setI(0); setEnergy(MAX_ENERGY); setStreak(0); setXp(0); setMistakes(0); setPicked(null); setWrong([]); setHint(false); };
  if (energy <= 0) return <OutOfEnergy onRetry={reset} onExit={onExit} />;

  const choose = (j: number) => {
    if (picked !== null || wrong.includes(j)) return;
    if (j === r.a) {
      play(variant === "bubble" ? "pop" : "correct");
      const s = streak + 1;
      setStreak(s);
      setXp((x) => x + answerXp(s));
      setPicked(j);
    } else {
      play("wrong");
      setStreak(0);
      setMistakes((m) => m + 1);
      setEnergy((e) => e - 1);
      setWrong((w) => [...w, j]);
      setHint(true);
    }
  };
  const next = () => {
    if (i + 1 >= rounds.length) { onDone(starsFor(mistakes), xp, mistakes); return; }
    play("click");
    setI(i + 1); setPicked(null); setWrong([]); setHint(false);
  };

  const altitude = Math.round(((i + (picked !== null ? 1 : 0)) / rounds.length) * 100);

  return (
    <div>
      <MissionTop title={title} step={i + 1} total={rounds.length} energy={energy} onExit={onExit} />
      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <Panel>
          <p className="eq text-xs uppercase tracking-widest text-sky-deep">Streak {streak} · +{xp} XP</p>
          <h3 className="mt-2 text-xl font-semibold md:text-2xl">{r.q}</h3>
          <div className={`mt-6 grid gap-4 ${variant === "bubble" ? "sm:grid-cols-3" : ""}`}>
            {r.options.map((o, j) => {
              const isRight = picked !== null && j === r.a;
              const isWrong = wrong.includes(j);
              const base = variant === "bubble"
                ? "aspect-square rounded-full p-3 text-center text-sm sm:text-base animate-bob"
                : "rounded-2xl px-4 py-3 text-left";
              return (
                <button
                  key={j}
                  onClick={() => choose(j)}
                  style={variant === "bubble" ? { animationDelay: `${j * 0.4}s` } : undefined}
                  className={`${base} border-4 border-ink font-semibold transition hover:scale-105 ${isRight ? "bg-leaf animate-popin" : isWrong ? "bg-coral/60 line-through animate-shake" : variant === "bubble" ? "bg-sky/40" : "bg-sun/60"}`}
                >
                  {variant === "bubble" && !isRight && !isWrong && <span aria-hidden className="block text-xs">🫧</span>}
                  {o}
                </button>
              );
            })}
          </div>
          <div className="mt-5 space-y-3">
            {hint && picked === null && <Pip>Hint: {r.hint}</Pip>}
            {picked !== null && (
              <div className="animate-popin space-y-3">
                <Pip><b>Correct!</b> {r.why}</Pip>
                <GameButton tone="leaf" onClick={next}>{i + 1 >= rounds.length ? "Finish mission ★" : "Next →"}</GameButton>
              </div>
            )}
          </div>
        </Panel>
        {variant === "skyship" && (
          <Panel className="flex items-center gap-3 md:flex-col md:justify-between">
            <p className="eq text-xs">ALTITUDE</p>
            <div className="relative h-6 w-full rounded-full border-2 border-ink bg-sky/30 md:h-64 md:w-8" aria-label={`Altitude ${altitude}%`}>
              <div className="absolute bottom-0 left-0 h-full rounded-full bg-leaf transition-all duration-700 md:h-auto md:w-full" style={{ width: undefined, ["--a" as string]: `${altitude}%`, height: undefined }} />
              <div className="absolute bottom-0 left-0 rounded-full bg-leaf transition-all duration-700 max-md:h-full md:w-full" style={{ height: `var(--h)`, width: `var(--w)`, ["--h" as string]: `${altitude}%`, ["--w" as string]: "100%" }} />
            </div>
            <p className="text-3xl animate-bob">🎈</p>
          </Panel>
        )}
      </div>
    </div>
  );
}
