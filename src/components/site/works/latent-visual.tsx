"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { DemoTag, type Rgb, Segmented, mixRgb } from "./shared";

/**
 * Latent：アイデアは温度を持ち、放っておくと指数関数的に冷めて色が薄れる。
 * 触れると「再燃」して、にじみが広がり色が戻る。
 */

const WARM: Rgb = [178, 78, 22];
const COLD: Rgb = [146, 157, 170];

const IDEAS = [
  { text: "雨の日だけ開く本屋", age: 0 },
  { text: "忘れることを、設計に組み込む", age: 4 },
  { text: "駅ごとの発車メロディを集める", age: 13 },
  { text: "祖母の味噌汁を聞き書きする", age: 30 },
  { text: "温度のあるメモ帳", age: 75 },
];

// 冷める速さ。実際のアプリと同じ 3 段階（時定数は日数）
const SPEEDS = { ゆっくり: 70, ふつう: 26, はやい: 9 } as const;
type Speed = keyof typeof SPEEDS;

const DAYS_PER_SECOND = 2.2;
const TICK = 200;

const ageLabel = (days: number) => {
  if (days < 1) return "たった今";
  if (days < 7) return `${Math.floor(days)}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}か月前`;
  return "1年以上前";
};

export function LatentVisual({ active }: { active: boolean }) {
  const [ages, setAges] = useState(() => IDEAS.map((idea) => idea.age));
  const [speed, setSpeed] = useState<Speed>("ふつう");
  const [burst, setBurst] = useState<{ index: number; key: number } | null>(null);
  const [surfaced, setSurfaced] = useState<number | null>(null);
  const burstKey = useRef(0);

  const tau = SPEEDS[speed];
  // 小数の桁を丸めておく（サーバーとブラウザで末尾の桁がずれると、ハイドレーションで食い違う）
  const temps = ages.map((age) => Math.round(Math.exp(-age / tau) * 1000) / 1000);

  const ignite = useCallback((index: number) => {
    setAges((current) => current.map((age, i) => (i === index ? 0 : age)));
    setBurst({ index, key: ++burstKey.current });
    setSurfaced((current) => (current === index ? null : current));
  }, []);

  // 時間を早送りで進める
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setAges((current) => current.map((age) => Math.min(age + (DAYS_PER_SECOND * TICK) / 1000, 400)));
    }, TICK);
    return () => window.clearInterval(timer);
  }, [active]);

  // すべてが冷めかけたら、いちばん古いアイデアを「浮上」させる
  const hottest = Math.max(...temps);
  useEffect(() => {
    if (!active || surfaced !== null || hottest > 0.3) return;
    setSurfaced(ages.indexOf(Math.max(...ages)));
  }, [active, surfaced, hottest, ages]);

  // 浮上したまま触れられなければ、少し待ってから自分で再燃させて見せる
  useEffect(() => {
    if (!active || surfaced === null) return;
    const timer = window.setTimeout(() => ignite(surfaced), 2600);
    return () => window.clearTimeout(timer);
  }, [active, surfaced, ignite]);

  return (
    <div className="flex h-full flex-col justify-between p-[clamp(1.1rem,4.5cqw,2.75rem)] text-[rgb(61_56_51)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[clamp(1.05rem,2.5cqw,1.5rem)] font-semibold leading-none tracking-[-0.01em]">
          Latent
        </span>
        <Segmented
          label="冷める速さ"
          options={Object.keys(SPEEDS) as Speed[]}
          value={speed}
          onChange={setSpeed}
          className="bg-[rgb(61_56_51/0.07)]"
          activeClassName="bg-[rgb(61_56_51)] text-[rgb(247_244_238)]"
        />
      </div>

      <ul className="-my-1">
        {IDEAS.map((idea, i) => {
          const temp = temps[i];
          const isSurfaced = surfaced === i;
          return (
            <li key={idea.text} className="relative">
              <button
                type="button"
                className="group relative flex w-full items-baseline justify-between gap-4 py-[clamp(0.5rem,2.1cqh,1.15rem)] text-left"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") ignite(i);
                }}
                onClick={() => ignite(i)}
                aria-label={`${idea.text}（${ageLabel(ages[i])}）を再燃させる`}
              >
                {/* 温かいアイデアほど、紙の上に光がにじむ */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-[6%] inset-y-0 rounded-[50%] blur-2xl transition-opacity duration-700 ease-linear"
                  style={{
                    background: `radial-gradient(closest-side, rgb(${WARM.join(" ")} / 0.42), transparent)`,
                    opacity: Number((temp ** 1.6).toFixed(3)),
                  }}
                />
                <AnimatePresence>
                  {burst?.index === i && (
                    <motion.span
                      key={burst.key}
                      aria-hidden
                      className="pointer-events-none absolute left-[12%] top-1/2 h-[220%] w-[60%] -translate-y-1/2 rounded-[50%] blur-xl"
                      style={{ background: `radial-gradient(closest-side, rgb(${WARM.join(" ")} / 0.6), transparent)` }}
                      initial={{ scale: 0.1, opacity: 0.9 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </AnimatePresence>

                <span
                  className="relative font-mincho text-[clamp(1.02rem,3.5cqw,2.5rem)] font-medium leading-snug tracking-[0.06em] transition-[color,opacity] duration-700 ease-linear"
                  style={{ color: mixRgb(COLD, WARM, temp ** 0.75), opacity: Number((0.3 + 0.7 * temp).toFixed(3)) }}
                >
                  {idea.text}
                </span>
                <span className="relative flex shrink-0 items-center gap-2 text-[clamp(11px,1.12cqw,14.5px)] tracking-[0.08em] text-[rgb(61_56_51/0.5)]">
                  <AnimatePresence>
                    {isSurfaced && (
                      <motion.span
                        className="rounded-full border border-[rgb(178_78_22/0.5)] px-2 py-1 text-[clamp(10px,0.95cqw,12.5px)] leading-none text-[rgb(178_78_22)]"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                      >
                        浮上
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="tabular-nums">{ageLabel(ages[i])}</span>
                </span>
              </button>
              <span aria-hidden className="block h-px bg-[rgb(61_56_51/0.1)]" />
            </li>
          );
        })}
      </ul>

      <div>
        <div className="mb-3 flex items-center gap-3 text-[clamp(10px,0.95cqw,12.5px)] tracking-[0.12em] text-[rgb(61_56_51/0.55)]">
          <span>温</span>
          <span
            aria-hidden
            className="h-[3px] flex-1 rounded-full"
            style={{
              background: `linear-gradient(to right, rgb(${WARM.join(" ")}), rgb(${COLD.join(" ")} / 0.35))`,
            }}
          />
          <span>冷</span>
        </div>
        <DemoTag className="text-[rgb(61_56_51/0.5)]" hint="なぞると、再燃します" />
      </div>
    </div>
  );
}
