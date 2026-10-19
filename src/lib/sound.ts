/* ------------------------------------------------------------------ *
 *  UI sound design. Every sound is synthesised with the Web Audio API,
 *  so there are no audio files to load. Kept quiet and short: soft ticks
 *  and blips that sit under the interaction, not on top of it.
 *
 *  Browsers only allow audio after a user gesture, so the context is
 *  created lazily on the first sound, which is always triggered by one.
 * ------------------------------------------------------------------ */

export type SoundName =
  | "hover"
  | "click"
  | "pickup"
  | "drop"
  | "toggle-on"
  | "toggle-off"
  | "open"
  | "close"
  | "arrange"
  | "zoom-in"
  | "zoom-out";

const STORAGE_KEY = "rk-sound";
const HOVER_GAP_MS = 45; // stops a sweep across many items turning into a buzz

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let lastHover = 0;
const listeners = new Set<() => void>();

try {
  if (typeof window !== "undefined") enabled = localStorage.getItem(STORAGE_KEY) !== "off";
} catch {
  // Storage can be blocked; sound simply stays on.
}

function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out: master! };
}

// A single enveloped oscillator, optionally gliding between two pitches.
function tone(type: OscillatorType, from: number, to: number, duration: number, gain: number, delay = 0) {
  const { ctx, out } = audio();
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(env).connect(out);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

// Band-passed noise with a sweeping centre: clicks and air.
function noise(duration: number, gain: number, from: number, to: number) {
  const { ctx, out } = audio();
  const t = ctx.currentTime;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + duration * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(env).connect(out);
  src.start(t);
}

const recipes: Record<SoundName, () => void> = {
  hover: () => tone("sine", 2600, 2200, 0.035, 0.025),
  click: () => {
    tone("triangle", 1400, 700, 0.05, 0.06);
    noise(0.03, 0.04, 4000, 2000);
  },
  pickup: () => tone("sine", 320, 560, 0.09, 0.07),
  drop: () => {
    tone("sine", 480, 170, 0.12, 0.08);
    noise(0.05, 0.03, 900, 300);
  },
  "toggle-on": () => {
    tone("sine", 880, 880, 0.06, 0.05);
    tone("sine", 1320, 1320, 0.08, 0.05, 0.06);
  },
  "toggle-off": () => {
    tone("sine", 1320, 1320, 0.06, 0.05);
    tone("sine", 880, 880, 0.08, 0.05, 0.06);
  },
  open: () => tone("sine", 600, 1100, 0.08, 0.05),
  close: () => tone("sine", 1100, 600, 0.08, 0.05),
  arrange: () => {
    noise(0.35, 0.05, 400, 3000);
    tone("sine", 520, 1040, 0.3, 0.03);
  },
  "zoom-in": () => tone("sine", 900, 1250, 0.05, 0.04),
  "zoom-out": () => tone("sine", 1250, 900, 0.05, 0.04),
};

export function play(name: SoundName) {
  if (!enabled || typeof window === "undefined") return;
  if (name === "hover") {
    // Hovers before any click would be silent anyway (no gesture yet).
    if (!ctx) return;
    const now = performance.now();
    if (now - lastHover < HOVER_GAP_MS) return;
    lastHover = now;
  }
  try {
    recipes[name]();
  } catch {
    // Audio is decoration; never let it break an interaction.
  }
}

export const sound = {
  isEnabled: () => enabled,
  setEnabled(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {}
    if (on) play("toggle-on");
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
