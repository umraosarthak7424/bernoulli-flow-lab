import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

type AudioPrefs = { effects: boolean; music: boolean; volume: number };
const STORAGE_KEY = "bernoulli-site-audio-settings";
const DEFAULT_PREFS: AudioPrefs = { effects: true, music: false, volume: 0.22 };

function tone(ctx: AudioContext, frequency: number, duration: number, volume: number, type: OscillatorType = "sine") {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), ctx.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration + 0.03);
}

export function SiteAudioControls() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onQuest = pathname.startsWith("/game");
  const [prefs, setPrefs] = useState<AudioPrefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const prefsRef = useRef(prefs);
  const contextRef = useRef<AudioContext | null>(null);
  prefsRef.current = prefs;

  const getContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext;
      if (!AudioContextClass) return null;
      contextRef.current = new AudioContextClass();
    }
    if (contextRef.current.state === "suspended") void contextRef.current.resume();
    return contextRef.current;
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AudioPrefs>;
        setPrefs({
          effects: typeof parsed.effects === "boolean" ? parsed.effects : true,
          music: typeof parsed.music === "boolean" ? parsed.music : false,
          volume: typeof parsed.volume === "number" ? Math.min(0.5, Math.max(0, parsed.volume)) : DEFAULT_PREFS.volume,
        });
      }
    } catch { /* Ignore invalid local preferences. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [loaded, prefs]);

  useEffect(() => {
    if (onQuest) return;
    let lastInputSound = 0;
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target?.closest("button, a, summary, [role='button'], [data-sfx]")) return;
      setUnlocked(true);
      const current = prefsRef.current;
      if (current.effects) {
        const ctx = getContext();
        if (ctx) tone(ctx, 620, 0.065, 0.035 * current.volume, "triangle");
      }
    };
    const handleInput = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== "range") return;
      const now = performance.now();
      if (now - lastInputSound < 140) return;
      lastInputSound = now;
      setUnlocked(true);
      const current = prefsRef.current;
      if (current.effects) {
        const ctx = getContext();
        if (ctx) tone(ctx, 760, 0.045, 0.025 * current.volume, "sine");
      }
    };
    document.addEventListener("click", handleClick, true);
    document.addEventListener("input", handleInput, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("input", handleInput, true);
    };
  }, [getContext, onQuest]);

  useEffect(() => {
    if (onQuest || !unlocked || !prefs.music) return;
    const ctx = getContext();
    if (!ctx) return;
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    let index = 0;
    const tick = () => {
      if (document.hidden) return;
      tone(ctx, notes[index % notes.length]!, 0.72, 0.022 * prefsRef.current.volume, "sine");
      if (index % 4 === 0) tone(ctx, notes[index % notes.length]! / 2, 1.05, 0.012 * prefsRef.current.volume, "triangle");
      index++;
    };
    tick();
    const timer = window.setInterval(tick, 1450);
    return () => window.clearInterval(timer);
  }, [getContext, onQuest, unlocked, prefs.music]);

  useEffect(() => () => { if (contextRef.current) void contextRef.current.close(); }, []);

  if (onQuest) return null;
  const toggleEffects = () => setPrefs((p) => ({ ...p, effects: !p.effects }));
  const toggleMusic = () => {
    setUnlocked(true);
    getContext();
    setPrefs((p) => ({ ...p, music: !p.music }));
  };

  return (
    <div className="flex items-center gap-1.5" aria-label="Website audio controls">
      <button type="button" onClick={toggleEffects} aria-pressed={prefs.effects}
        className="audio-toggle rounded-lg border border-border px-2.5 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-glow active:scale-95"
        title="Toggle sound effects">{prefs.effects ? "🔊 Effects" : "🔇 Effects"}</button>
      <button type="button" onClick={toggleMusic} aria-pressed={prefs.music}
        className="audio-toggle rounded-lg border border-border px-2.5 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-glow active:scale-95"
        title="Toggle background music">{prefs.music ? "♫ Music on" : "♫ Music off"}</button>
    </div>
  );
}
