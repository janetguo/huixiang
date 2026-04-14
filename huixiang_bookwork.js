import { useState, useEffect, useRef, useCallback } from "react";

const H = 25, W = 25;
const SETS = [
  { title: "EchoOoOOoooes",   init: "口", guests: ["曰","回","吅","㗊","响","昌","唱"] },
  { title: "See the forest for the trees",  init: "人", guests: ["木","从","丛","林","森","树"] },
  { title: "placeholder", init: "口", guests: ["曰","回","吅","㗊","响","昌","唱"] },
  { title: "placeholder",  init: "口", guests: ["曰","回","吅","㗊","响","昌","唱"] },
];
const FREQS = [0.05, 0.08, 0.1, 0.15, 0.3]; // is there something more interesting i can set it as
const PHASE_MS = 3000;
const rc = a => a[Math.floor(Math.random() * a.length)];

function Grid({ set }) {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: H }, () => Array(W).fill(set.init))
  );
  const phase = useRef(0);
  const timer = useRef(null);

  const runPhase = useCallback(() => {
    if (phase.current >= set.guests.length) return;
    const guest = set.guests[phase.current];
    const freq = rc(FREQS);
    const total = Math.floor(H * W * freq);
    const interval = PHASE_MS / total;
    let placed = 0;
    const pool = Array.from({ length: H * W }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const targets = pool.slice(0, total);

    timer.current = setInterval(() => {
      if (placed >= total) {
        clearInterval(timer.current);
        phase.current++;
        runPhase();
        return;
      }
      const idx = targets[placed];
      setGrid(g => {
        const next = g.map(r => [...r]);
        next[Math.floor(idx / W)][idx % W] = guest;
        return next;
      });
      placed++;
    }, interval);
  }, [set]);

  useEffect(() => {
    runPhase();
    return () => clearInterval(timer.current);
  }, [runPhase]);

  return (
    <pre style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
      lineHeight: "1.2",
      letterSpacing: "2px",
      textAlign: "center",
    }}>
      {grid.map(r => r.join("")).join("\n")}
    </pre>
  );
}

export default function App() {
  const [view, setView] = useState(null);
  const [key, setKey] = useState(0);

  if (view !== null) {
    return (
      <div style={{ background: "#000", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <button
          onClick={() => setView(null)}
          style={{
            position: "fixed", top: 24, left: 24,
            background: "none", border: "none", color: "#fff",
            fontFamily: "'Times New Roman', serif", fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h2 style={{ fontFamily: "'Times New Roman', serif", fontWeight: 400, marginBottom: 32 }}>
          {SETS[view].title}
        </h2>
        <Grid key={key} set={SETS[view]} />
      </div>
    );
  }

  return (
    <div style={{
      background: "#000", color: "#fff", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48,
    }}>
      {SETS.map((s, i) => (
        <div
          key={i}
          onClick={() => { setView(i); setKey(k => k + 1); }}
          style={{
            fontFamily: "'Times New Roman', serif",
            fontSize: "24px",
            cursor: "pointer",
            padding: "12px 32px",
            border: "1px solid #fff",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
        >
          {s.title}
        </div>
      ))}
    </div>
  );
}
