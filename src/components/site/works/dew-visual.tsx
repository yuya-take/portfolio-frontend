"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { DemoTag, type Rgb, Segmented, mixRgb } from "./shared";

/**
 * Dew：水やりの間隔を設定させない。「水をあげた」の 1 タップと、
 * 任意の土の回答から株ごとの間隔を学習し、季節で伸び縮みさせる。
 */

const GREEN: Rgb = [61, 90, 69];
const DRY: Rgb = [176, 150, 84];

// 季節による補正。冬は伸ばし、夏は縮める
const SEASONS = { 春: 1, 夏: 0.75, 秋: 1, 冬: 1.5 } as const;
type Season = keyof typeof SEASONS;

const ANSWERS = [
  { label: "カラカラだった", delta: -0.5, note: "遅すぎたようです。次から少し早めに知らせます。" },
  { label: "ちょうど乾いてた", delta: 0, note: "推定どおり。間隔はそのままにします。" },
  { label: "まだ湿ってた", delta: 0.5, note: "早すぎたようです。次から少し間をあけます。" },
] as const;

const DAYS_PER_SECOND = 0.55;
const TICK = 100;

const LEAVES = [
  { y: 128, side: 1, rest: -18, size: 0.9 },
  { y: 122, side: -1, rest: -22, size: 0.95 },
  { y: 98, side: 1, rest: -30, size: 1.05 },
  { y: 92, side: -1, rest: -34, size: 1 },
  { y: 68, side: 1, rest: -44, size: 0.85 },
  { y: 64, side: -1, rest: -48, size: 0.8 },
];

function Plant({ dryness, splash }: { dryness: number; splash: number }) {
  const droop = Math.min(dryness, 1.2) * 34;
  const leaf = mixRgb(GREEN, DRY, Math.max(0, dryness - 0.55) * 1.4);

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: 装飾。aria-hidden で読み上げから外している
    <svg viewBox="0 0 200 220" className="h-full w-full overflow-visible" aria-hidden>
      <path d="M100 142 C 98 110, 103 80, 100 48" fill="none" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      {LEAVES.map((item) => (
        <g key={item.y} transform={`translate(100 ${item.y}) scale(${item.side * item.size} ${item.size})`}>
          <motion.path
            d="M0 0 C 12 -15, 36 -15, 48 0 C 36 13, 12 13, 0 0 Z"
            fill={leaf}
            style={{ transformBox: "fill-box", originX: 0, originY: 0.5 }}
            animate={{ rotate: item.rest + droop }}
            transition={{ type: "spring", stiffness: 60, damping: 9 }}
          />
        </g>
      ))}
      <motion.path
        d="M100 50 C 90 36, 92 22, 100 12 C 108 22, 110 36, 100 50 Z"
        fill={leaf}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
        animate={{ rotate: droop * 0.5 }}
        transition={{ type: "spring", stiffness: 60, damping: 9 }}
      />

      {/* 鉢 */}
      <path
        d="M58 142 h84 a3 3 0 0 1 3 3 v8 a3 3 0 0 1 -3 3 h-84 a3 3 0 0 1 -3 -3 v-8 a3 3 0 0 1 3 -3 Z"
        fill="#C97B55"
      />
      <path d="M62 156 h76 l-8 46 a7 7 0 0 1 -7 6 h-46 a7 7 0 0 1 -7 -6 Z" fill="#B96B47" />
      <ellipse cx="100" cy="143" rx="38" ry="3.5" fill={mixRgb([74, 56, 44], [148, 124, 100], dryness)} />

      {/* 水をあげた瞬間のしずく */}
      {splash > 0 && (
        <g key={splash}>
          <motion.path
            d="M100 0 C 94 9, 92 13, 92 17 a8 8 0 0 0 16 0 C 108 13, 106 9, 100 0 Z"
            fill="#7FB2C9"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: [-30, 108], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.75, ease: "easeIn", times: [0, 0.15, 0.85, 1] }}
          />
          <motion.ellipse
            cx="100"
            cy="143"
            rx="38"
            ry="3.5"
            fill="none"
            stroke="#7FB2C9"
            strokeWidth="1.5"
            style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.5], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.1, delay: 0.7, ease: "easeOut" }}
          />
        </g>
      )}
    </svg>
  );
}

export function DewVisual({ active }: { active: boolean }) {
  const [base, setBase] = useState(4);
  const [season, setSeason] = useState<Season>("春");
  const [elapsed, setElapsed] = useState(1.6);
  const [history, setHistory] = useState([3, 4, 4]);
  const [asking, setAsking] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [splash, setSplash] = useState(0);
  // 誰も触れていない間は、自動で水やりを繰り返して見せる
  const [auto, setAuto] = useState(true);
  const elapsedRef = useRef(elapsed);
  elapsedRef.current = elapsed;

  const interval = base * SEASONS[season];
  const dryness = elapsed / interval;
  const remaining = Math.ceil(interval - elapsed - 0.001);
  const due = remaining <= 0;

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setElapsed((current) => Math.min(current + (DAYS_PER_SECOND * TICK) / 1000, 12));
    }, TICK);
    return () => window.clearInterval(timer);
  }, [active]);

  const water = useCallback(() => {
    const days = Math.max(1, Math.round(elapsedRef.current));
    setHistory((current) => [...current.slice(-2), days]);
    setElapsed(0);
    setSplash((current) => current + 1);
    setAsking(true);
    setNote(null);
  }, []);

  const answer = useCallback((index: number) => {
    const choice = ANSWERS[index];
    setBase((current) => Math.min(9, Math.max(1.5, current + choice.delta)));
    setNote(choice.note);
    setAsking(false);
  }, []);

  useEffect(() => {
    if (!active || !auto) return;
    if (asking) {
      const timer = window.setTimeout(() => answer(1), 2200);
      return () => window.clearTimeout(timer);
    }
    if (dryness >= 1.12) water();
  }, [active, auto, asking, dryness, water, answer]);

  const ring = 2 * Math.PI * 96;
  const accent = due ? "rgb(191 122 48)" : "rgb(61 90 69)";

  return (
    <div className="flex h-full flex-col justify-between p-[clamp(1.1rem,4.5cqw,2.75rem)] text-[rgb(31_29_26)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[clamp(1.05rem,2.5cqw,1.5rem)] font-semibold leading-none tracking-[-0.01em] text-[rgb(61_90_69)]">
          Dew
        </span>
        <Segmented
          label="季節"
          options={Object.keys(SEASONS) as Season[]}
          value={season}
          onChange={(value) => {
            setAuto(false);
            setSeason(value);
          }}
          className="bg-[rgb(61_90_69/0.09)]"
          activeClassName="bg-[rgb(61_90_69)] text-[rgb(250_248_243)]"
        />
      </div>

      {/* 狭いときは「鉢・残り日数／内訳」の 2 段、広いときは鉢の右に残り日数と内訳を積む */}
      <div className="grid min-h-0 flex-1 grid-cols-[auto_1fr] content-center items-center gap-x-[5cqw] gap-y-[3cqh] py-[2cqh] [grid-template-areas:'plant_count''detail_detail'] [@container(min-width:520px)]:[grid-template-areas:'plant_count''plant_detail'] [@container(min-width:520px)]:[grid-template-rows:1fr_1fr]">
        <div className="relative aspect-square w-[min(38cqw,34cqh)] [grid-area:plant] [@container(min-width:520px)]:w-[min(44cqw,56cqh)]">
          {/* 土が乾いていく進み具合 */}
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: 装飾。aria-hidden で読み上げから外している */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgb(61 90 69 / 0.12)" strokeWidth="2" />
            <circle
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={ring}
              strokeDashoffset={ring * (1 - Math.min(dryness, 1))}
              style={{ transition: "stroke-dashoffset 0.4s linear, stroke 0.6s" }}
            />
          </svg>
          <div className="absolute inset-[13%]">
            <Plant dryness={dryness} splash={splash} />
          </div>
        </div>

        <div className="min-w-0 [grid-area:count] [@container(min-width:520px)]:self-end">
          <p className="text-[clamp(11px,1.12cqw,14.5px)] tracking-[0.14em] text-[rgb(133_128_111)]">
            バジル ・ 次の水やりまで
          </p>
          <p
            className="mt-2 flex h-[clamp(3.2rem,15cqw,9rem)] items-baseline gap-2 leading-none"
            style={{ color: accent }}
          >
            {due ? (
              <span className="self-center font-mincho text-[clamp(1.9rem,8cqw,4.6rem)] font-medium tracking-[0.06em]">
                きょう
              </span>
            ) : (
              <>
                <span className="font-mincho text-[clamp(0.85rem,2.6cqw,1.5rem)] font-medium">あと</span>
                <span className="tabular-nums text-[clamp(3.2rem,15cqw,9rem)] font-extralight tracking-[-0.04em]">
                  {remaining}
                </span>
                <span className="font-mincho text-[clamp(0.85rem,2.6cqw,1.5rem)] font-medium">日</span>
              </>
            )}
          </p>
        </div>

        <dl className="min-w-0 space-y-2 border-t border-[rgb(31_29_26/0.12)] pt-3 text-[clamp(11.5px,1.2cqw,15.5px)] tracking-[0.06em] [grid-area:detail] [@container(min-width:520px)]:self-start">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[rgb(133_128_111)]">学習した間隔</dt>
            <dd className="tabular-nums whitespace-nowrap font-medium">
              <motion.span
                key={base}
                className="inline-block"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {base.toFixed(1)}
              </motion.span>{" "}
              日
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[rgb(133_128_111)]">季節の補正（{season}）</dt>
            <dd className="tabular-nums whitespace-nowrap font-medium">× {SEASONS[season].toFixed(2)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[rgb(133_128_111)]">これまでの間隔</dt>
            <dd className="tabular-nums flex items-center gap-1.5 whitespace-nowrap font-medium">
              {history.map((days, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 並びがそのまま履歴の順
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="h-px w-2 bg-[rgb(31_29_26/0.25)]" />}
                  {days}日
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <div className="relative mb-4 flex min-h-[78px] items-end [@container(min-width:520px)]:min-h-[48px]">
          <AnimatePresence mode="wait" initial={false}>
            {asking ? (
              <motion.div
                key="ask"
                className="flex w-full flex-wrap items-center gap-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <span className="mr-1 w-full text-[clamp(11px,1.12cqw,14.5px)] tracking-[0.08em] text-[rgb(133_128_111)] [@container(min-width:520px)]:w-auto">
                  土はどうでしたか？（任意）
                </span>
                {ANSWERS.map((choice, i) => (
                  <button
                    key={choice.label}
                    type="button"
                    onClick={() => {
                      setAuto(false);
                      answer(i);
                    }}
                    className="rounded-full border border-[rgb(61_90_69/0.35)] px-3 py-2 text-[clamp(11.5px,1.2cqw,15.5px)] leading-none text-[rgb(61_90_69)] transition-colors duration-300 hover:bg-[rgb(61_90_69)] hover:text-[rgb(250_248_243)]"
                  >
                    {choice.label}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="water"
                className="flex w-full items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuto(false);
                    water();
                  }}
                  className="relative flex shrink-0 items-center gap-2.5 rounded-full bg-[rgb(61_90_69)] py-3.5 pl-4 pr-5 text-[clamp(13px,1.35cqw,16.5px)] font-medium leading-none text-[rgb(250_248_243)] transition-transform duration-300 active:scale-95"
                >
                  {due && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-[rgb(61_90_69/0.35)] [animation-duration:1.8s]" />
                  )}
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: 装飾。aria-hidden で読み上げから外している */}
                  <svg viewBox="0 0 16 16" className="relative h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M8 1 C 5 5.5, 3.5 7.5, 3.5 10 a4.5 4.5 0 0 0 9 0 C 12.5 7.5, 11 5.5, 8 1 Z" />
                  </svg>
                  <span className="relative">水をあげた</span>
                </button>
                <p className="text-[clamp(11.5px,1.2cqw,15.5px)] leading-relaxed tracking-[0.04em] text-[rgb(133_128_111)]">
                  {note ?? "間隔を決める欄はありません。記録するだけで、株ごとに学習します。"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <DemoTag className="text-[rgb(31_29_26/0.45)]" hint="水をあげて、季節を変えてみてください" />
      </div>
    </div>
  );
}
