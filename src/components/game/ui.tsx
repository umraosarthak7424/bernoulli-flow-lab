import type { ReactNode } from "react";
import { MAX_ENERGY } from "@/lib/game/engine";

export type MissionProps = { onDone: (stars: number, xp: number, mistakes: number) => void; onExit: () => void };

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border-4 border-ink/80 bg-cloud p-5 text-ink shadow-[0_6px_0_var(--ink)] ${className}`}>{children}</div>;
}

export function GameButton({ children, onClick, tone = "sun", disabled, className = "", ...rest }: { children: ReactNode; onClick?: () => void; tone?: "sun" | "leaf" | "coral" | "sky" | "candy"; disabled?: boolean; className?: string; "aria-label"?: string }) {
  const tones = { sun: "bg-sun", leaf: "bg-leaf", coral: "bg-coral", sky: "bg-sky", candy: "bg-candy" };
  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border-4 border-ink px-4 py-2 font-display font-semibold text-ink shadow-[0_4px_0_var(--ink)] transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Energy({ value }: { value: number }) {
  return (
    <span aria-label={`Energy ${value} of ${MAX_ENERGY}`} className="text-lg tracking-tight">
      {Array.from({ length: MAX_ENERGY }, (_, i) => (i < value ? "⚡" : "·")).join(" ")}
    </span>
  );
}

export function MissionTop({ title, step, total, energy, onExit }: { title: string; step: number; total: number; energy: number; onExit: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <GameButton tone="sky" onClick={onExit} aria-label="Back to map">← Map</GameButton>
      <h2 className="font-display text-2xl font-semibold text-cloud drop-shadow">{title}</h2>
      <div className="flex items-center gap-3 rounded-2xl bg-cloud/90 px-3 py-1 text-ink">
        <span className="eq text-sm">{step}/{total}</span>
        <Energy value={energy} />
      </div>
    </div>
  );
}

export function OutOfEnergy({ onRetry, onExit }: { onRetry: () => void; onExit: () => void }) {
  return (
    <Panel className="mx-auto max-w-md text-center animate-popin">
      <p className="text-5xl">🪫</p>
      <h3 className="mt-2 text-2xl font-semibold">Out of energy!</h3>
      <p className="mt-2">Pip needs a recharge. Every scientist gets things wrong first — try again!</p>
      <div className="mt-4 flex justify-center gap-3">
        <GameButton tone="leaf" onClick={onRetry}>Try again</GameButton>
        <GameButton tone="sky" onClick={onExit}>Map</GameButton>
      </div>
    </Panel>
  );
}

/** Pip the robot-bird guide with a speech bubble. */
export function Pip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-end gap-3">
      <svg viewBox="0 0 60 60" className="h-14 w-14 shrink-0 animate-bob" aria-hidden>
        <ellipse cx="30" cy="34" rx="20" ry="18" fill="var(--sun)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="24" cy="30" r="5" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="24" cy="30" r="2" fill="var(--ink)" />
        <circle cx="37" cy="30" r="5" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="37" cy="30" r="2" fill="var(--ink)" />
        <path d="M28 38 l4 6 l4 -6z" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
        <path d="M30 16 v-8" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="30" cy="7" r="3" fill="var(--candy)" />
      </svg>
      <div className="rounded-2xl rounded-bl-none border-2 border-ink bg-cloud px-3 py-2 text-sm text-ink">{children}</div>
    </div>
  );
}
