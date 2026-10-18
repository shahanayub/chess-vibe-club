let ctx;
function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null; // jsdom/tests: silently skip
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ freq, to, type = 'sine', at = 0, dur = 0.12, vol = 0.2 }) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur);
}

const sounds = {
  move: () => tone({ freq: 440, to: 300, type: 'triangle', dur: 0.08 }),
  capture: () => {
    tone({ freq: 200, to: 80, type: 'square', dur: 0.15, vol: 0.25 });
    tone({ freq: 500, to: 150, type: 'sawtooth', dur: 0.1, vol: 0.12 });
  },
  promotion: () =>
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, at: i * 0.08, dur: 0.15 })),
  check: () => {
    tone({ freq: 880, type: 'square', dur: 0.1, vol: 0.15 });
    tone({ freq: 880, type: 'square', at: 0.15, dur: 0.1, vol: 0.15 });
  },
  gameOver: () =>
    [523, 392, 330, 262].forEach((f, i) =>
      tone({ freq: f, at: i * 0.18, dur: 0.3, type: 'triangle', vol: 0.25 })
    ),
};

// Picks the sound from SAN (e.g. "Qxe5+", "e8=Q#")
export function playMoveSound(san, isGameOver) {
  if (!san) return;
  if (san.includes('#') || isGameOver) return sounds.gameOver();
  if (san.includes('=')) return sounds.promotion();
  if (san.includes('+')) return sounds.check();
  if (san.includes('x')) return sounds.capture();
  sounds.move();
}