/** Bernoulli Quest game rules — pure and tested. */
export const MISSIONS = [
  { id: "bubble", title: "Bubble Burst", badge: "flow-explorer", blurb: "Pop the right answers before they drift away." },
  { id: "watergun", title: "Water Gun Battle", badge: "pressure-detective", blurb: "Tune pressure and nozzle to soak the silly zombies." },
  { id: "pipes", title: "Pipe Maze", badge: "equation-architect", blurb: "Rotate pipes to carry water to the city." },
  { id: "skyship", title: "Skyship Rescue", badge: "bernoulli-master", blurb: "Use everything you learned to save the skyship." },
] as const;

export type MissionId = (typeof MISSIONS)[number]["id"];
export type BadgeId = (typeof MISSIONS)[number]["badge"];

export const BADGES: Record<BadgeId, { name: string; icon: string }> = {
  "flow-explorer": { name: "Flow Explorer", icon: "🫧" },
  "pressure-detective": { name: "Pressure Detective", icon: "🔍" },
  "equation-architect": { name: "Equation Architect", icon: "📐" },
  "bernoulli-master": { name: "Bernoulli Master", icon: "🏆" },
};

export type Progress = { xp: number; stars: Partial<Record<MissionId, number>>; completed: MissionId[]; badges: BadgeId[] };
export const EMPTY: Progress = { xp: 0, stars: {}, completed: [], badges: [] };
export const MAX_ENERGY = 5;
export const STORAGE_KEY = "bernoulli-quest-v1";

export function isUnlocked(p: Progress, id: MissionId): boolean {
  const i = MISSIONS.findIndex((m) => m.id === id);
  return i === 0 || p.completed.includes(MISSIONS[i - 1]!.id);
}

/** First unfinished unlocked mission, or the final one when all are done. */
export function nextMission(p: Progress): MissionId {
  return (MISSIONS.find((m) => !p.completed.includes(m.id)) ?? MISSIONS[MISSIONS.length - 1]!).id;
}

/** XP for a correct answer on a given streak (1 = first in a row): 10, 15, 20 … capped at 30. */
export function answerXp(streak: number): number {
  return 10 + 5 * Math.min(Math.max(streak - 1, 0), 4);
}

/** Stars from mistakes made: 0 → 3★, 1–2 → 2★, more → 1★. */
export function starsFor(mistakes: number): number {
  return mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
}

/** Record a finished mission: adds XP, keeps the best star count, unlocks its badge once. */
export function completeMission(p: Progress, id: MissionId, stars: number, xp: number): { progress: Progress; newBadge: BadgeId | null } {
  const badge = MISSIONS.find((m) => m.id === id)!.badge;
  const newBadge = p.badges.includes(badge) ? null : badge;
  return {
    newBadge,
    progress: {
      xp: p.xp + Math.max(0, Math.round(xp)),
      stars: { ...p.stars, [id]: Math.max(p.stars[id] ?? 0, Math.min(3, Math.max(1, stars))) },
      completed: p.completed.includes(id) ? p.completed : [...p.completed, id],
      badges: newBadge ? [...p.badges, newBadge] : p.badges,
    },
  };
}

export function totalStars(p: Progress): number {
  return Object.values(p.stars).reduce((a, b) => a + (b ?? 0), 0);
}

/** Parse saved progress defensively; anything malformed falls back to a fresh start. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return EMPTY;
  try {
    const o = JSON.parse(raw);
    const ids = MISSIONS.map((m) => m.id as string);
    const badges = MISSIONS.map((m) => m.badge as string);
    const stars: Progress["stars"] = {};
    for (const id of ids) {
      const s = o?.stars?.[id];
      if (typeof s === "number" && s >= 1 && s <= 3) stars[id as MissionId] = Math.round(s);
    }
    return {
      xp: typeof o?.xp === "number" && o.xp >= 0 ? Math.round(o.xp) : 0,
      stars,
      completed: Array.isArray(o?.completed) ? o.completed.filter((x: unknown) => ids.includes(x as string)) : [],
      badges: Array.isArray(o?.badges) ? o.badges.filter((x: unknown) => badges.includes(x as string)) : [],
    };
  } catch {
    return EMPTY;
  }
}

export function levelFor(xp: number) {
  const level = Math.floor(xp / 150) + 1;
  return { level, into: xp % 150, need: 150 };
}
