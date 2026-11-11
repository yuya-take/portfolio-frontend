"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { DemoTag, cn } from "./shared";

/**
 * ScoreScreen AI：試合を記録すると、スコアボードと打球の分布が埋まっていき、
 * 試合が終わると AI の分析が届く。
 */

type Game = {
  away: number[];
  home: (number | null)[];
  hits: { away: number[]; home: number[] };
  errors: { away: number; home: number };
  report: string;
};

const GAMES: Game[] = [
  {
    away: [0, 1, 0, 0, 2, 0, 0, 1, 0],
    home: [2, 0, 0, 1, 0, 0, 3, 0, null],
    hits: { away: [1, 2, 0, 1, 2, 1, 0, 1, 1], home: [2, 1, 0, 2, 1, 0, 3, 1, 0] },
    errors: { away: 1, home: 0 },
    report:
      "7回の3得点は、すべて2アウトから。下位打線の出塁が流れを変えました。次戦は7番を2番に上げる打順を提案します。",
  },
  {
    away: [1, 0, 0, 3, 0, 0, 0, 0, 1],
    home: [0, 0, 2, 0, 0, 1, 0, 0, 0],
    hits: { away: [2, 0, 1, 3, 0, 1, 0, 1, 2], home: [0, 1, 2, 0, 1, 2, 0, 1, 0] },
    errors: { away: 0, home: 2 },
    report:
      "失点の6割が四球で出した走者から。先発の球数は4回に急増しています。継投の目安を80球に置くことを提案します。",
  },
];

const HALF_INNINGS = 18;
const STEP_MS = 430;
const HOLD_MS = 7000;

// グラウンドの座標系（viewBox 300×200）。ホームベースを中心に左右 45°
const HOME = { x: 150, y: 188 };
const FENCE = 165;

type Dot = { x: number; y: number; team: "away" | "home"; step: number };

/** 試合ごとに同じ場所へ打球が落ちるよう、種つきの乱数で散らす */
const sprayDots = (game: Game, seed: number): Dot[] => {
  let state = seed;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  const dots: Dot[] = [];
  for (let inning = 0; inning < 9; inning++) {
    for (const team of ["away", "home"] as const) {
      for (let i = 0; i < game.hits[team][inning]; i++) {
        const angle = (random() * 2 - 1) * 0.72;
        const reach = (0.4 + random() * 0.52) * FENCE;
        dots.push({
          x: HOME.x + Math.sin(angle) * reach,
          y: HOME.y - Math.cos(angle) * reach,
          team,
          step: inning * 2 + (team === "home" ? 1 : 0),
        });
      }
    }
  }
  return dots;
};

const sum = (values: (number | null)[]) => values.reduce<number>((total, value) => total + (value ?? 0), 0);

function Field({
  dots,
  step,
  extra,
  onHit,
}: {
  dots: Dot[];
  step: number;
  extra: { x: number; y: number; key: number }[];
  onHit: (x: number, y: number) => void;
}) {
  return (
    <svg
      viewBox="0 0 300 200"
      className="h-full w-full cursor-crosshair overflow-visible"
      onPointerDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        // preserveAspectRatio（中央寄せ）で生じる余白を差し引いて、viewBox の座標に直す
        const scale = Math.min(rect.width / 300, rect.height / 200);
        const x = (event.clientX - rect.left - (rect.width - 300 * scale) / 2) / scale;
        const y = (event.clientY - rect.top - (rect.height - 200 * scale) / 2) / scale;
        const dx = x - HOME.x;
        const dy = HOME.y - y;
        if (dy > 0 && Math.abs(dx) <= dy && Math.hypot(dx, dy) <= FENCE) onHit(x, y);
      }}
      role="img"
      aria-label="打球の分布図"
    >
      <g fill="none" stroke="rgb(var(--card-fg) / 0.22)" strokeWidth="1">
        <path d="M150 188 L33.3 71.3 A165 165 0 0 1 266.7 71.3 Z" fill="rgb(var(--card-fg) / 0.03)" />
        <path d="M82.8 120.8 A95 95 0 0 1 217.2 120.8" strokeDasharray="2 4" />
        <path d="M150 188 L193.8 144.2 L150 100.4 L106.2 144.2 Z" />
      </g>
      {[
        [150, 188],
        [193.8, 144.2],
        [150, 100.4],
        [106.2, 144.2],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x - 3}
          y={y - 3}
          width="6"
          height="6"
          transform={`rotate(45 ${x} ${y})`}
          fill="rgb(var(--card-fg) / 0.85)"
        />
      ))}

      {dots.map(
        (dot, i) =>
          step > dot.step && (
            // biome-ignore lint/suspicious/noArrayIndexKey: 試合ごとに並びが決まっている
            <g key={i}>
              <motion.line
                x1={HOME.x}
                y1={HOME.y}
                x2={dot.x}
                y2={dot.y}
                stroke={dot.team === "home" ? "rgb(var(--card-accent))" : "rgb(var(--card-fg))"}
                strokeWidth="0.8"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: 0.14 }}
                transition={{ pathLength: { duration: 0.45, ease: "easeOut" }, opacity: { duration: 1.6, delay: 0.4 } }}
              />
              <motion.circle
                cx={dot.x}
                cy={dot.y}
                r="3.2"
                fill={dot.team === "home" ? "rgb(var(--card-accent))" : "rgb(var(--card-panel))"}
                stroke={dot.team === "home" ? "rgb(var(--card-accent))" : "rgb(var(--card-fg) / 0.8)"}
                strokeWidth="1.2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.35 }}
              />
            </g>
          ),
      )}

      {extra.map((dot) => (
        <g key={dot.key}>
          <motion.circle
            cx={dot.x}
            cy={dot.y}
            r="4"
            fill="none"
            stroke="rgb(var(--card-accent))"
            strokeWidth="1"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          <motion.circle
            cx={dot.x}
            cy={dot.y}
            r="3.6"
            fill="rgb(var(--card-accent))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
          />
        </g>
      ))}
    </svg>
  );
}

export function ScoreScreenVisual({ active }: { active: boolean }) {
  const [gameIndex, setGameIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [extra, setExtra] = useState<{ x: number; y: number; key: number }[]>([]);

  const game = GAMES[gameIndex];
  const dots = useMemo(() => sprayDots(game, 7 + gameIndex * 31), [game, gameIndex]);
  const finished = step >= HALF_INNINGS;

  // 半イニングずつ試合を進める
  useEffect(() => {
    if (!active || finished) return;
    const timer = window.setInterval(() => setStep((current) => current + 1), STEP_MS);
    return () => window.clearInterval(timer);
  }, [active, finished]);

  // レポートを読める時間だけ置いて、次の試合へ
  useEffect(() => {
    if (!active || !finished) return;
    const timer = window.setTimeout(() => {
      setGameIndex((current) => (current + 1) % GAMES.length);
      setStep(0);
      setExtra([]);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [active, finished]);

  const shown = (team: "away" | "home", inning: number) => step > inning * 2 + (team === "home" ? 1 : 0);
  const totals = (team: "away" | "home") => {
    const runs = sum(game[team].filter((_, inning) => shown(team, inning)));
    const hits = sum(game.hits[team].filter((_, inning) => shown(team, inning))) + (team === "home" ? extra.length : 0);
    return { runs, hits, errors: finished ? game.errors[team] : 0 };
  };

  const status = finished ? "試合終了" : `${Math.floor(step / 2) + 1}回${step % 2 === 0 ? "表" : "裏"}`;

  return (
    <div className="flex h-full flex-col justify-between p-[clamp(1.1rem,4.5cqw,2.75rem)] text-card-fg">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[clamp(1.05rem,2.5cqw,1.5rem)] font-semibold leading-none tracking-[-0.01em]">
          ScoreScreen AI
        </span>
        <span className="flex items-center gap-2 text-[clamp(11.5px,1.2cqw,15.5px)] tracking-[0.1em] text-card-fg/70">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", finished ? "bg-card-fg/40" : "animate-pulse bg-[rgb(255_86_64)]")}
          />
          {status}
        </span>
      </div>

      {/* スコアボード */}
      <div className="tabular-nums mt-[2.5cqh] font-mono text-[clamp(10.5px,2.2cqw,20px)] leading-none" aria-hidden>
        <div className="grid grid-cols-[3.4em_repeat(9,minmax(0,1fr))_0.8em_repeat(3,minmax(0,1.25fr))] gap-y-[0.75em] text-center">
          <span />
          {Array.from({ length: 9 }, (_, inning) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 回の並びは固定
            <span key={inning} className="text-[0.8em] text-card-fg/40">
              {inning + 1}
            </span>
          ))}
          <span />
          {["R", "H", "E"].map((label) => (
            <span key={label} className="text-[0.8em] text-card-fg/40">
              {label}
            </span>
          ))}

          {(["away", "home"] as const).map((team) => {
            const total = totals(team);
            return [
              <span key={`${team}-name`} className="text-left text-[0.8em] tracking-[0.14em] text-card-fg/60">
                {team === "away" ? "AWAY" : "HOME"}
              </span>,
              ...game[team].map((runs, inning) => {
                const current = !finished && step === inning * 2 + (team === "home" ? 1 : 0);
                return (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: 回の並びは固定
                    key={`${team}-${inning}`}
                    className={cn(
                      "relative flex h-[1.9em] items-center justify-center rounded-[3px]",
                      current && "bg-card-accent/15 ring-1 ring-inset ring-card-accent/60",
                    )}
                  >
                    {shown(team, inning) ? (
                      <motion.span
                        className={cn(runs ? "text-card-accent" : "text-card-fg/55")}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {runs ?? "x"}
                      </motion.span>
                    ) : (
                      <span className="text-card-fg/15">·</span>
                    )}
                  </span>
                );
              }),
              <span key={`${team}-gap`} />,
              ...(["runs", "hits", "errors"] as const).map((key) => (
                <span
                  key={`${team}-${key}`}
                  className={cn(
                    "flex h-[1.9em] items-center justify-center font-medium",
                    key === "runs" ? "text-card-accent" : "text-card-fg/85",
                  )}
                >
                  {total[key]}
                </span>
              )),
            ];
          })}
        </div>
      </div>

      <div className="relative my-[1.5cqh] min-h-0 flex-1">
        <Field
          dots={dots}
          step={step}
          extra={extra}
          onHit={(x, y) => setExtra((current) => [...current.slice(-11), { x, y, key: Date.now() }])}
        />
        <div className="pointer-events-none absolute left-0 top-0 flex flex-col gap-2 text-[clamp(10.5px,1.05cqw,13px)] tracking-[0.06em] text-card-fg/55">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-card-accent" />
            Home
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full border border-card-fg/80" />
            Away
          </span>
        </div>
      </div>

      <div>
        <div className="mb-4 rounded-2xl border border-card-fg/15 bg-card-fg/[0.04] p-[clamp(0.85rem,2.6cqw,1.25rem)]">
          <p className="mb-2 text-[clamp(10.5px,1.05cqw,13px)] tracking-[0.06em] text-card-accent">AI レポート</p>
          {/* 文章の長さぶんの高さを先に確保して、切り替えで上下に揺れないようにする */}
          <p className="relative text-[clamp(11.5px,2.1cqw,17px)] leading-[1.85] tracking-[0.04em]">
            <span className="invisible" aria-hidden>
              {game.report}
            </span>
            <span
              className={cn("absolute inset-0 transition-opacity duration-700", finished ? "opacity-0" : "opacity-100")}
              aria-hidden={finished}
            >
              <span className="text-card-fg/40">試合を記録しています。終了すると、ここに分析が届きます。</span>
            </span>
            <span
              className={cn("absolute inset-0 transition-opacity duration-700", finished ? "opacity-100" : "opacity-0")}
              aria-hidden={!finished}
            >
              {game.report}
            </span>
          </p>
        </div>
        <DemoTag className="text-card-fg/45" hint="グラウンドをクリックで、安打を記録" />
      </div>
    </div>
  );
}
