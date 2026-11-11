"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DemoTag, cn } from "./shared";

/**
 * Insaporire：同じ料理を作り直すたびにバージョンを重ね、2 つを並べて違いを見る。
 * 基準材料を決めた料理では、比率を保ったまま分量を換算できる。
 */

type Row = { name: string; base?: boolean; v3: number | null; v4: number | null };

// 基準材料（強力粉）を 100 とした比率
const ROWS: Row[] = [
  { name: "強力粉", base: true, v3: 100, v4: 100 },
  { name: "水", v3: 70, v4: 75 },
  { name: "塩", v3: 2, v4: 2 },
  { name: "ドライイースト", v3: 0.6, v4: 0.4 },
  { name: "はちみつ", v3: null, v4: 3 },
];

const META = [
  { label: "その日の条件", v3: "室温 26℃ ・ 発酵 90 分", v4: "室温 19℃ ・ 発酵 150 分" },
  { label: "気づき", v3: "クラムが詰まり気味。加水を上げたい。", v4: "気泡が大きくなった。次は焼成を 5 分短く。" },
];

const MIN = 150;
const MAX = 1000;

const grams = (ratio: number | null, flour: number) => {
  if (ratio === null) return "—";
  const value = (ratio / 100) * flour;
  return value >= 20 ? String(Math.round(value)) : value.toFixed(1);
};

const percent = (ratio: number | null) => (ratio === null ? "" : `${ratio}%`);

function Cell({
  ratio,
  flour,
  changed,
  delay,
  active,
}: {
  ratio: number | null;
  flour: number;
  changed?: boolean;
  delay: number;
  active: boolean;
}) {
  return (
    <span className="relative flex items-baseline justify-end gap-2 px-[clamp(0.5rem,1.8cqw,0.9rem)] py-[clamp(0.45rem,1.9cqh,0.8rem)]">
      {changed && (
        // 前のバージョンから変わった箇所を塗って強調する
        <motion.span
          aria-hidden
          className="absolute inset-y-[3px] inset-x-0 origin-left rounded-md bg-[rgb(138_63_31/0.13)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay }}
        />
      )}
      <span className={cn("tabular-nums relative font-medium", changed && "text-[rgb(138_63_31)]")}>
        {grams(ratio, flour)}
        {ratio !== null && <span className="ml-0.5 text-[0.78em] font-normal opacity-60">g</span>}
      </span>
      <span className="tabular-nums relative w-[3.4em] text-right text-[0.82em] opacity-55">{percent(ratio)}</span>
    </span>
  );
}

export function InsaporireVisual({ active }: { active: boolean }) {
  const [flour, setFlour] = useState(300);
  const progress = ((flour - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="flex h-full flex-col justify-between p-[clamp(1.1rem,4.5cqw,2.75rem)] text-[rgb(31_27_22)]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="text-[clamp(1.05rem,2.5cqw,1.5rem)] font-semibold leading-none tracking-[-0.01em] text-[rgb(138_63_31)]">
            Insaporire
          </span>
        </div>
        <p className="text-right text-[clamp(11px,1.12cqw,14.5px)] tracking-[0.1em] text-[rgb(92_85_75)]">
          カンパーニュ ・ <span className="font-medium text-[rgb(31_27_22)]">v3 と v4 を比較</span>
        </p>
      </div>

      <div className="text-[clamp(11.5px,2.15cqw,18px)]">
        <div className="grid grid-cols-[1.25fr_1fr_1fr] items-end border-b border-[rgb(31_27_22/0.75)] pb-2 text-[0.82em] tracking-[0.1em] text-[rgb(92_85_75)]">
          <span>材料</span>
          <span className="px-[clamp(0.5rem,1.8cqw,0.9rem)] text-right">
            <span className="mr-1.5 text-[1.25em] font-semibold tracking-normal text-[rgb(31_27_22)]">v3</span>
            6月12日
          </span>
          <span className="px-[clamp(0.5rem,1.8cqw,0.9rem)] text-right">
            <span className="mr-1.5 text-[1.25em] font-semibold tracking-normal text-[rgb(138_63_31)]">v4</span>
            10月3日
          </span>
        </div>

        {ROWS.map((row, i) => (
          <motion.div
            key={row.name}
            className="grid grid-cols-[1.25fr_1fr_1fr] items-center border-b border-[rgb(31_27_22/0.1)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.07 }}
          >
            <span className="flex items-center gap-2 tracking-[0.06em]">
              {row.name}
              {row.base && (
                <span className="rounded-full border border-[rgb(138_63_31/0.5)] px-1.5 py-0.5 text-[0.72em] leading-none text-[rgb(138_63_31)]">
                  基準
                </span>
              )}
            </span>
            <Cell ratio={row.v3} flour={flour} delay={0} active={active} />
            <Cell ratio={row.v4} flour={flour} changed={row.v3 !== row.v4} delay={0.6 + i * 0.1} active={active} />
          </motion.div>
        ))}

        {META.map((item, i) => (
          // 狭いときは見出しを上に出して、2 つのバージョンを左右に並べる
          <motion.div
            key={item.label}
            className="grid grid-cols-2 items-start gap-y-1 border-b border-[rgb(31_27_22/0.1)] py-[clamp(0.45rem,1.9cqh,0.8rem)] text-[0.86em] leading-relaxed [@container(min-width:520px)]:grid-cols-[1.25fr_1fr_1fr]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
            transition={{ duration: 0.6, delay: 0.55 + i * 0.07 }}
          >
            <span className="col-span-2 tracking-[0.1em] text-[rgb(92_85_75)] [@container(min-width:520px)]:col-span-1">
              {item.label}
            </span>
            <span className="pr-3 text-[rgb(31_27_22/0.7)] [@container(min-width:520px)]:px-[clamp(0.5rem,1.8cqw,0.9rem)]">
              {item.v3}
            </span>
            <span className="text-[rgb(138_63_31)] [@container(min-width:520px)]:px-[clamp(0.5rem,1.8cqw,0.9rem)]">
              {item.v4}
            </span>
          </motion.div>
        ))}
      </div>

      <div>
        <label className="mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 text-[clamp(11.5px,1.2cqw,15.5px)] tracking-[0.08em]">
          <span className="text-[rgb(92_85_75)]">
            スケール
            <span className="ml-2 hidden text-[rgb(92_85_75/0.7)] sm:inline">基準の強力粉を</span>
          </span>
          <input
            type="range"
            className="scale-range"
            min={MIN}
            max={MAX}
            step={10}
            value={flour}
            onChange={(event) => setFlour(Number(event.target.value))}
            aria-label="基準材料（強力粉）の分量"
            aria-valuetext={`${flour} グラム`}
            style={
              {
                "--range-progress": `${progress}%`,
                "--range-fill": "rgb(138 63 31)",
                "--range-track": "rgb(31 27 22 / 0.15)",
                "--range-halo": "rgb(138 63 31 / 0.14)",
              } as React.CSSProperties
            }
          />
          <span className="tabular-nums w-[4.2em] text-right text-[1.9em] font-light leading-none tracking-[-0.02em] text-[rgb(138_63_31)]">
            {flour}
            <span className="ml-0.5 text-[0.42em] font-normal tracking-normal">g</span>
          </span>
        </label>
        <DemoTag className="text-[rgb(31_27_22/0.45)]" hint="比率を保ったまま、分量が変わります" />
      </div>
    </div>
  );
}
