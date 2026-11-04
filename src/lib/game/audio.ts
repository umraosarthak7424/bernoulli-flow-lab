/** Synthesized Web Audio sound effects + low-volume music. Created only after a user gesture. */
export type Sfx = "click" | "pop" | "correct" | "wrong" | "sparkle" | "fanfare" | "blast" | "splash" | "zombie" | "victory";

type Settings = { sound: boolean; music: boolean; volume: number };
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let settings: Settings = { sound: true, music: false, volume: 0.6 };

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.connect(master);
    apply();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function apply() {
  if (master) master.gain.value = settings.volume;
  if (musicGain) musicGain.gain.value = settings.music ? 0.12 : 0;
}

export function setAudio(s: Settings) {
  settings = s;
  apply();
  if (!s.music) stopMusic();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.3, slideTo?: number, dest?: AudioNode) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + start + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(dest ?? master!);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

function noise(start: number, dur: number, vol = 0.3, freq = 1200) {
  const c = ctx!;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(master!);
  src.start(c.currentTime + start);
}

export function play(s: Sfx) {
  if (!settings.sound || !ensure()) return;
  switch (s) {
    case "click": tone(660, 0, 0.06, "triangle", 0.15); break;
    case "pop": tone(500, 0, 0.12, "sine", 0.35, 1400); noise(0, 0.08, 0.2, 3000); break;
    case "correct": [523, 659, 784].forEach((f, i) => tone(f, i * 0.08, 0.2, "triangle", 0.25)); break;
    case "wrong": tone(220, 0, 0.18, "square", 0.08, 180); tone(196, 0.16, 0.22, "square", 0.08, 150); break;
    case "sparkle": [1319, 1568, 2093, 2637].forEach((f, i) => tone(f, i * 0.05, 0.15, "sine", 0.12)); break;
    case "fanfare": [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, i === 5 ? 0.6 : 0.16, "sawtooth", 0.1)); break;
    case "blast": noise(0, 0.45, 0.35, 900); tone(160, 0, 0.3, "sine", 0.2, 80); break;
    case "splash": noise(0, 0.35, 0.3, 2200); break;
    case "zombie": tone(300, 0, 0.25, "sawtooth", 0.1, 120); tone(420, 0.22, 0.3, "triangle", 0.15, 700); break;
    case "victory": [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.3, "triangle", 0.22)); break;
  }
}

const MELODY = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 880, 784, 659, 587];
export function startMusic() {
  if (!settings.music || musicTimer || !ensure()) return;
  let i = 0;
  const step = () => {
    if (!ctx || !musicGain) return;
    const f = MELODY[i % MELODY.length]!;
    tone(f, 0, 0.35, "sine", 0.5, undefined, musicGain);
    if (i % 4 === 0) tone(f / 4, 0, 1.1, "triangle", 0.4, undefined, musicGain);
    i++;
  };
  step();
  musicTimer = setInterval(step, 300);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
}

/** Called when leaving the game: silence everything. */
export function shutdownAudio() {
  stopMusic();
  if (ctx) void ctx.suspend();
}
