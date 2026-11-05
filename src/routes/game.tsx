import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { meta } from "@/components/SiteLayout";
import { GameButton, Panel, Pip } from "@/components/game/ui";
import { QuizMission } from "@/components/game/QuizMission";
import { WaterGun } from "@/components/game/WaterGun";
import { PipeMaze } from "@/components/game/PipeMaze";
import { BADGES, EMPTY, MISSIONS, STORAGE_KEY, completeMission, isUnlocked, levelFor, nextMission, parseProgress, totalStars, type BadgeId, type MissionId, type Progress } from "@/lib/game/engine";
import { BUBBLE_ROUNDS, SKYSHIP } from "@/lib/game/questions";
import { play, setAudio, shutdownAudio, startMusic, stopMusic } from "@/lib/game/audio";

export const Route = createFileRoute("/game")({
  head: () => meta("Bernoulli Quest — Physics Adventure Game", "Play four missions in Sky Harbor: pop bubbles, soak zombies, fix pipes and rescue a skyship using Bernoulli's principle."),
  component: Game,
});

const SETTINGS_KEY = "bernoulli-quest-settings";
const ICONS: Record<MissionId, string> = { bubble: "🫧", watergun: "💦", pipes: "🔧", skyship: "🎈" };
// Island positions on the map (percent of map box).
const SPOTS: Record<MissionId, { x: number; y: number }> = { bubble: { x: 14, y: 62 }, watergun: { x: 38, y: 34 }, pipes: { x: 62, y: 64 }, skyship: { x: 85, y: 30 } };

type Reward = { id: MissionId; stars: number; xp: number; badge: BadgeId | null };

function Game() {
  const [p, setP] = useState<Progress>(EMPTY);
  const [view, setView] = useState<MissionId | "map" | "certificate">("map");
  const [reward, setReward] = useState<Reward | null>(null);
  const [settings, setSettings] = useState({ sound: true, music: false, volume: 0.6 });
  const [name, setName] = useState("");

  useEffect(() => {
    setP(parseProgress(localStorage.getItem(STORAGE_KEY)));
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null");
      if (s && typeof s.sound === "boolean") setSettings({ sound: s.sound, music: !!s.music, volume: Math.min(1, Math.max(0, Number(s.volume) || 0.6)) });
    } catch { /* ignore */ }
    return () => shutdownAudio();
  }, []);
  useEffect(() => { setAudio(settings); localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings]);

  const save = (n: Progress) => { setP(n); localStorage.setItem(STORAGE_KEY, JSON.stringify(n)); };
  const finish = (id: MissionId) => (stars: number, xp: number) => {
    const { progress, newBadge } = completeMission(p, id, stars, xp + stars * 10);
    save(progress);
    play(id === "skyship" ? "victory" : "fanfare");
    setReward({ id, stars, xp: xp + stars * 10, badge: newBadge });
    setView("map");
  };
  const open = (id: MissionId) => { play("click"); setView(id); };
  const toggleMusic = () => {
    const music = !settings.music;
    setSettings({ ...settings, music });
    if (music) setTimeout(startMusic, 0); else stopMusic();
  };
  const lv = levelFor(p.xp);
  const exit = () => setView("map");

  return (
    <div className="bg-sky-gradient relative min-h-[calc(100vh-56px)] overflow-hidden pb-16">
      {/* drifting clouds */}
      <div aria-hidden className="pointer-events-none absolute inset-0 no-print">
        {[10, 28, 46].map((t, i) => (
          <div key={t} className="animate-drift absolute h-10 w-32 rounded-full bg-cloud/70" style={{ top: `${t}%`, animationDelay: `${-i * 13}s`, animationDuration: `${40 + i * 12}s` }} />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-6">
        {/* HUD */}
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border-4 border-ink bg-cloud/95 px-4 py-2 text-ink shadow-[0_4px_0_var(--ink)]">
          <span className="font-display text-xl font-semibold">Bernoulli Quest</span>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <span>Lv {lv.level}</span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-24 overflow-hidden rounded-full border-2 border-ink bg-sky/30"><span className="block h-full bg-sun" style={{ width: `${(lv.into / lv.need) * 100}%` }} /></span>
              {p.xp} XP
            </span>
            <span>⭐ {totalStars(p)}/12</span>
            <span aria-label="Badges">{p.badges.map((b) => BADGES[b].icon).join(" ") || "No badges yet"}</span>
            <button onClick={() => setSettings({ ...settings, sound: !settings.sound })} className="rounded-lg border-2 border-ink px-2" aria-label="Toggle sound">{settings.sound ? "🔊" : "🔇"}</button>
            <button onClick={toggleMusic} className="rounded-lg border-2 border-ink px-2" aria-label="Toggle music">{settings.music ? "🎵 On" : "🎵 Off"}</button>
            <input type="range" min={0} max={1} step={0.1} value={settings.volume} onChange={(e) => setSettings({ ...settings, volume: Number(e.target.value) })} aria-label="Volume" className="w-20 accent-[var(--sky-deep)]" />
          </div>
        </div>

        {view === "map" && (
          <>
            <div className="mb-5 grid items-end gap-4 md:grid-cols-[auto_1fr]">
              <Ava />
              <Panel>
                <h1 className="font-display text-3xl font-semibold md:text-4xl">Welcome to Sky Harbor!</h1>
                <p className="mt-2">I'm <b>Ava</b>, and this is <b>Pip</b>. A storm has scrambled the harbor's flow machines. Use Bernoulli's principle to fix them, one island at a time.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <GameButton tone="sun" onClick={() => open(nextMission(p))}>▶ Play {MISSIONS.find((m) => m.id === nextMission(p))!.title}</GameButton>
                  {p.badges.includes("bernoulli-master") && <GameButton tone="candy" onClick={() => setView("certificate")}>🏅 Certificate</GameButton>}
                  {p.xp > 0 && <GameButton tone="sky" onClick={() => { if (confirm("Reset all Quest progress?")) save(EMPTY); }}>Reset</GameButton>}
                </div>
              </Panel>
            </div>

            {/* Map */}
            <div className="relative hidden aspect-[16/7] rounded-[2rem] border-4 border-ink bg-sky/40 md:block">
              <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                <path d="M14 27 C 25 5, 30 10, 38 15 S 55 35, 62 28 S 78 5, 85 13" fill="none" stroke="var(--cloud)" strokeWidth="0.8" strokeDasharray="2 1.5" />
              </svg>
              {MISSIONS.map((m) => <Island key={m.id} m={m} p={p} onOpen={open} pos={SPOTS[m.id]} />)}
            </div>
            <div className="grid gap-4 md:hidden">
              {MISSIONS.map((m) => <Island key={m.id} m={m} p={p} onOpen={open} />)}
            </div>
            <p className="mt-4 text-center text-sm text-cloud">Progress is saved in this browser only. Physics here is simplified for play — see the Venturi Lab for the full model.</p>
          </>
        )}

        {view === "bubble" && <QuizMission title="Bubble Burst" rounds={BUBBLE_ROUNDS} variant="bubble" onDone={finish("bubble")} onExit={exit} />}
        {view === "watergun" && <WaterGun onDone={finish("watergun")} onExit={exit} />}
        {view === "pipes" && <PipeMaze onDone={finish("pipes")} onExit={exit} />}
        {view === "skyship" && <QuizMission title="Skyship Rescue" rounds={SKYSHIP} variant="skyship" onDone={finish("skyship")} onExit={exit} />}

        {view === "certificate" && (
          <div>
            <div className="no-print mb-4 flex flex-wrap items-center gap-3">
              <GameButton tone="sky" onClick={exit}>← Map</GameButton>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={40} className="rounded-xl border-4 border-ink bg-cloud px-3 py-2 text-ink" />
              <GameButton tone="sun" onClick={() => window.print()}>🖨 Print</GameButton>
            </div>
            <Panel className="print-area mx-auto max-w-3xl border-8 text-center">
              <p className="eq text-xs uppercase tracking-[0.3em]">Sky Harbor Academy</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Certificate of Mastery</h2>
              <p className="mt-6">This certifies that</p>
              <p className="mt-2 border-b-2 border-ink pb-2 font-display text-3xl">{name || "Young Scientist"}</p>
              <p className="mt-4">completed every Bernoulli Quest mission and earned the title</p>
              <p className="mt-2 text-2xl font-semibold">🏆 Bernoulli Master</p>
              <p className="eq mt-4">P + ½ρv² + ρgh = constant</p>
              <p className="mt-4 text-sm">⭐ {totalStars(p)}/12 stars · {p.xp} XP · {p.badges.map((b) => BADGES[b].name).join(" · ")}</p>
            </Panel>
          </div>
        )}
      </div>

      {reward && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" role="dialog" aria-modal="true" aria-label="Mission complete">
          <Panel className="max-w-sm text-center animate-popin">
            <p className="text-5xl">{ICONS[reward.id]}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Mission complete!</h3>
            <p className="mt-2 text-3xl">{"★".repeat(reward.stars)}<span className="opacity-25">{"★".repeat(3 - reward.stars)}</span></p>
            <p className="mt-1 font-semibold">+{reward.xp} XP</p>
            {reward.badge && <p className="mt-3 rounded-2xl bg-sun/50 p-2">New badge: {BADGES[reward.badge].icon} <b>{BADGES[reward.badge].name}</b></p>}
            <div className="mt-4 flex justify-center gap-3">
              <GameButton tone="leaf" onClick={() => setReward(null)}>Back to map</GameButton>
              {reward.id === "skyship" && <GameButton tone="candy" onClick={() => { setReward(null); setView("certificate"); }}>Certificate</GameButton>}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function Island({ m, p, onOpen, pos }: { m: (typeof MISSIONS)[number]; p: Progress; onOpen: (id: MissionId) => void; pos?: { x: number; y: number } }) {
  const unlocked = isUnlocked(p, m.id);
  const stars = p.stars[m.id] ?? 0;
  return (
    <button
      disabled={!unlocked}
      onClick={() => onOpen(m.id)}
      style={pos ? { left: `${pos.x}%`, top: `${pos.y}%` } : undefined}
      className={`${pos ? "absolute w-44 -translate-x-1/2 -translate-y-1/2" : "w-full"} group rounded-3xl border-4 border-ink bg-cloud p-3 text-left text-ink shadow-[0_5px_0_var(--ink)] transition hover:-translate-y-[55%] disabled:cursor-not-allowed disabled:opacity-60 max-md:hover:translate-y-0`}
    >
      <div className="flex items-center gap-2">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-ink text-2xl ${unlocked ? "bg-sun animate-bob" : "bg-muted-foreground/30"}`}>{unlocked ? ICONS[m.id] : "🔒"}</span>
        <div>
          <p className="font-display font-semibold leading-tight">{m.title}</p>
          <p className="text-sm">{"★".repeat(stars)}<span className="opacity-25">{"★".repeat(3 - stars)}</span></p>
        </div>
      </div>
      <p className="mt-1 text-xs">{unlocked ? m.blurb : "Finish the previous mission to unlock."}</p>
    </button>
  );
}

function Ava() {
  return (
    <div className="hidden md:block">
      <svg viewBox="0 0 120 160" className="h-40 w-32 animate-bob" role="img" aria-label="Ava, the young engineer">
        <rect x="35" y="78" width="50" height="60" rx="18" fill="var(--sky-deep)" stroke="var(--ink)" strokeWidth="4" />
        <circle cx="60" cy="50" r="30" fill="var(--sun)" stroke="var(--ink)" strokeWidth="4" />
        <path d="M30 45 Q60 5 90 45 Q80 25 60 25 Q40 25 30 45z" fill="var(--coral)" stroke="var(--ink)" strokeWidth="3" />
        <rect x="38" y="36" width="44" height="12" rx="6" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="50" cy="56" r="4" fill="var(--ink)" /><circle cx="70" cy="56" r="4" fill="var(--ink)" />
        <path d="M50 66 q10 8 20 0" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="40" y="138" width="14" height="16" fill="var(--ink)" /><rect x="66" y="138" width="14" height="16" fill="var(--ink)" />
        <path d="M85 95 l20 -15" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="108" cy="78" r="6" fill="var(--leaf)" stroke="var(--ink)" strokeWidth="3" />
      </svg>
      <div className="-mt-6 ml-16 hidden lg:block"><Pip>Let's go!</Pip></div>
    </div>
  );
}
