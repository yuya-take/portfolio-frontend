"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DemoTag, Segmented, cn } from "./shared";

/**
 * Triply：旅先で残した日記と支出が 1 本のタイムラインに並び、同じ支出から予算の残りが出る。
 * タイムラインも予算も同じ記録（RECORDS）から作るので、合計は必ずそろう。
 *
 * アプリの入力欄に合わせ、日記は日時・メモ・写真、支出は日時・カテゴリ・金額・メモだけを持つ
 * （日記や支出に場所を結びつける欄は、アプリにまだ無い）。
 */

type Category = "accommodation" | "food" | "sightseeing" | "shopping";

type Entry = { kind: "entry"; at: string; note: string; photos: number };
type Expense = { kind: "expense"; at: string; category: Category; amount: number; memo: string };
type TripRecord = Entry | Expense;

const CATEGORIES: { id: Category; label: string; budget: number }[] = [
  { id: "accommodation", label: "宿泊", budget: 16000 },
  { id: "food", label: "食事", budget: 8000 },
  { id: "sightseeing", label: "観光", budget: 3000 },
  { id: "shopping", label: "ショッピング", budget: 3000 },
];

// アプリと同じく、端末の時刻をタイムゾーンなしの文字列で持つ
const RECORDS: TripRecord[] = [
  { kind: "entry", at: "2026-10-10T10:20", note: "伏見稲荷。千本鳥居を上まで歩いた。朝は人が少ない。", photos: 4 },
  { kind: "expense", at: "2026-10-10T12:10", category: "food", amount: 1480, memo: "きつねうどん" },
  { kind: "entry", at: "2026-10-10T15:30", note: "清水寺。舞台からの紅葉は、まだ色づきはじめ。", photos: 6 },
  { kind: "expense", at: "2026-10-10T15:45", category: "sightseeing", amount: 500, memo: "拝観料" },
  { kind: "expense", at: "2026-10-10T18:30", category: "accommodation", amount: 14800, memo: "町家の宿" },
  { kind: "entry", at: "2026-10-11T09:10", note: "錦市場で、だし巻きと漬物を食べ歩き。", photos: 3 },
  { kind: "expense", at: "2026-10-11T10:30", category: "shopping", amount: 3600, memo: "お土産" },
];

const VIEWS = ["タイムライン", "予算"] as const;
type View = (typeof VIEWS)[number];

// アプリのタイムラインにある絞り込みと同じ 3 つ
const FILTERS = ["すべて", "日記", "支出"] as const;
type Filter = (typeof FILTERS)[number];

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const yen = (value: number) => `¥${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const timeOf = (at: string) => at.slice(11, 16);
const categoryLabel = (id: Category) => CATEGORIES.find((category) => category.id === id)?.label ?? "";
const isEntry = (record: TripRecord): record is Entry => record.kind === "entry";
const isExpense = (record: TripRecord): record is Expense => record.kind === "expense";
const sum = (expenses: Expense[]) => expenses.reduce((total, expense) => total + expense.amount, 0);

/** `10/10 (土)`。曜日は UTC で求めるので、見る人のタイムゾーンで日がずれない */
const dayLabel = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return `${month}/${day} (${WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]})`;
};

const ENTRIES = RECORDS.filter(isEntry);
const EXPENSES = RECORDS.filter(isExpense);
const BUDGET = CATEGORIES.reduce((total, category) => total + category.budget, 0);
const SPENT = sum(EXPENSES);

/** 日ごとにまとめる。新しい日が上、同じ日の中も新しい順（アプリのタイムラインと同じ並び） */
const groupByDay = (records: TripRecord[]) =>
  [...new Set(records.map((record) => record.at.slice(0, 10)))]
    .sort()
    .reverse()
    .map((date) => ({
      date,
      records: records.filter((record) => record.at.startsWith(date)).sort((a, b) => (a.at < b.at ? 1 : -1)),
    }));

const DAYS: Record<Filter, ReturnType<typeof groupByDay>> = {
  すべて: groupByDay(RECORDS),
  日記: groupByDay(ENTRIES),
  支出: groupByDay(EXPENSES),
};

const BY_CATEGORY = CATEGORIES.map((category) => ({
  ...category,
  spent: sum(EXPENSES.filter((expense) => expense.category === category.id)),
}));

function Bar({ ratio, over, active, delay }: { ratio: number; over?: boolean; active: boolean; delay: number }) {
  return (
    <span className="block h-[0.42em] overflow-hidden rounded-full bg-[#DDE4E1]">
      <motion.span
        className={cn("block h-full origin-left rounded-full", over ? "bg-[#BA1A1A]" : "bg-[#006A60]")}
        style={{ width: `${Math.min(ratio, 1) * 100}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      />
    </span>
  );
}

/** 見方や絞り込みを切り替えたときと、画面に入ったときに、行を順に出す */
function Row({
  index,
  active,
  className,
  children,
}: {
  index: number;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
    >
      {children}
    </motion.li>
  );
}

const ROW = "border-b border-[#BEC9C6]/60";
// 行の上下の余白。行の多いタイムラインは詰め、予算は広めに取る
const TIGHT = "py-[clamp(0.3rem,1.05cqh,0.6rem)]";
const LOOSE = "py-[clamp(0.45rem,2.1cqh,1.1rem)]";
const MUTED = "text-[#3F4947]/80";

function TimelineView({ active }: { active: boolean }) {
  const [filter, setFilter] = useState<Filter>("すべて");
  let index = 0;

  return (
    <div>
      <fieldset className="flex gap-x-[1.1em] text-[0.86em]">
        <legend className="sr-only">タイムラインの絞り込み</legend>
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === filter}
            onClick={() => setFilter(option)}
            className={cn(
              "border-b pb-[0.1em] transition-colors duration-300",
              option === filter
                ? "border-[#006A60] font-medium text-[#006A60]"
                : cn("border-transparent hover:text-[#161D1C]", MUTED),
            )}
          >
            {option}
          </button>
        ))}
      </fieldset>

      <div key={filter}>
        {DAYS[filter].map((day) => (
          <section key={day.date} className="mt-[clamp(0.35rem,1.4cqh,0.8rem)]">
            <h4 className={cn("tabular-nums text-[0.82em] font-medium", MUTED)}>{dayLabel(day.date)}</h4>
            <ul>
              {day.records.map((record) => (
                <Row
                  key={record.at}
                  index={index++}
                  active={active}
                  className={cn(ROW, TIGHT, "grid grid-cols-[2.9em_1fr_auto] items-baseline gap-x-[0.6em]")}
                >
                  <span className={cn("tabular-nums text-[0.86em]", MUTED)}>{timeOf(record.at)}</span>
                  {isEntry(record) ? (
                    <>
                      <span className="line-clamp-2">{record.note}</span>
                      <span className={cn("tabular-nums text-[0.82em]", MUTED)}>写真 {record.photos}枚</span>
                    </>
                  ) : (
                    <>
                      <span className="flex min-w-0 items-baseline gap-x-[0.6em]">
                        <span className="shrink-0 font-medium text-[#7C5800]">{categoryLabel(record.category)}</span>
                        <span className={cn("truncate text-[0.9em]", MUTED)}>{record.memo}</span>
                      </span>
                      <span className="tabular-nums font-semibold">{yen(record.amount)}</span>
                    </>
                  )}
                </Row>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function BudgetView({ active }: { active: boolean }) {
  return (
    <ul>
      {BY_CATEGORY.map((category, i) => {
        const rest = category.budget - category.spent;
        return (
          <Row key={category.id} index={i} active={active} className={cn(ROW, LOOSE)}>
            <span className="flex items-baseline justify-between gap-x-3">
              <span className="font-medium">{category.label}</span>
              <span className="tabular-nums">
                <span className="font-semibold">{yen(category.spent)}</span>
                <span className={cn("text-[0.86em]", MUTED)}> / {yen(category.budget)}</span>
              </span>
            </span>
            <span className="mt-[0.45em] block">
              <Bar ratio={category.spent / category.budget} over={rest < 0} active={active} delay={0.15 + i * 0.07} />
            </span>
            <span
              className={cn(
                "tabular-nums mt-[0.3em] block text-right text-[0.86em]",
                rest < 0 ? "font-medium text-[#BA1A1A]" : MUTED,
              )}
            >
              {rest < 0 ? `超過 ${yen(-rest)}` : `残り ${yen(rest)}`}
            </span>
          </Row>
        );
      })}
    </ul>
  );
}

export function TriplyVisual({ active }: { active: boolean }) {
  const [view, setView] = useState<View>("タイムライン");

  return (
    <div className="flex h-full flex-col p-[clamp(1.1rem,4.5cqw,2.75rem)] text-[#161D1C]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[clamp(1.05rem,2.5cqw,1.5rem)] font-semibold leading-none tracking-[-0.01em] text-[#006A60]">
          Triply
        </span>
        <Segmented
          label="見方"
          options={VIEWS}
          value={view}
          onChange={setView}
          className="bg-[#006A60]/10"
          activeClassName="bg-[#006A60] text-white"
        />
      </div>

      <div className="mt-[clamp(0.6rem,2.6cqh,1.4rem)] text-[clamp(11.5px,2.05cqw,16px)] leading-[1.5]">
        <p className="flex flex-wrap items-baseline justify-between gap-x-4">
          <span className="font-medium">
            京都 1泊2日<span className={cn("ml-[0.7em] text-[0.86em] font-normal", MUTED)}>10/10 – 10/11</span>
          </span>
          <span className={cn("tabular-nums text-[0.86em]", MUTED)}>
            日記 {ENTRIES.length} ・ 写真 {ENTRIES.reduce((total, entry) => total + entry.photos, 0)}
          </span>
        </p>
        <dl className="mt-[0.5em] grid grid-cols-3 gap-x-3">
          {[
            { label: "予算", value: BUDGET },
            { label: "支出", value: SPENT },
            { label: "残り", value: BUDGET - SPENT },
          ].map((item) => (
            <div key={item.label} className="flex flex-col-reverse">
              <dd className="tabular-nums text-[1.3em] font-semibold leading-[1.3] tracking-[-0.01em]">
                {yen(item.value)}
              </dd>
              <dt className={cn("text-[0.82em]", MUTED)}>{item.label}</dt>
            </div>
          ))}
        </dl>
        <span className="mt-[0.5em] block">
          <Bar ratio={SPENT / BUDGET} active={active} delay={0.2} />
        </span>
      </div>

      <div
        key={view}
        className="mt-[clamp(0.5rem,2.2cqh,1.2rem)] min-h-0 flex-1 text-[clamp(11.5px,2.05cqw,16px)] leading-[1.5]"
      >
        {view === "タイムライン" ? <TimelineView active={active} /> : <BudgetView active={active} />}
      </div>

      <DemoTag className="mt-3 text-[#161D1C]/45" hint="日記と支出を、1 本のタイムラインに" />
    </div>
  );
}
