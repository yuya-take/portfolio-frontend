"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DemoTag, Segmented, cn } from "./shared";

/**
 * Triply：旅先で残した日記と支出を、時間・場所・お金の 3 つの見方で振り返る。
 * 3 つの見方は同じ記録（RECORDS）から作るので、合計は必ずそろう。
 */

type Category = "accommodation" | "food" | "sightseeing" | "shopping";
type PlaceId = "fushimi" | "kiyomizu" | "yado" | "nishiki";

type Entry = { kind: "entry"; at: string; place: PlaceId; note: string; photos: number };
type Expense = { kind: "expense"; at: string; place: PlaceId; category: Category; amount: number };
type TripRecord = Entry | Expense;

// 訪れた順
const PLACES: { id: PlaceId; name: string }[] = [
  { id: "fushimi", name: "伏見稲荷大社" },
  { id: "kiyomizu", name: "清水寺" },
  { id: "yado", name: "東山の宿" },
  { id: "nishiki", name: "錦市場" },
];

const CATEGORIES: { id: Category; label: string; budget: number }[] = [
  { id: "accommodation", label: "宿泊", budget: 16000 },
  { id: "food", label: "食事", budget: 8000 },
  { id: "sightseeing", label: "観光", budget: 3000 },
  { id: "shopping", label: "ショッピング", budget: 3000 },
];

// アプリと同じく、端末の時刻をタイムゾーンなしの文字列で持つ
const RECORDS: TripRecord[] = [
  {
    kind: "entry",
    at: "2026-10-10T10:20",
    place: "fushimi",
    note: "千本鳥居を上まで歩いた。朝は人が少ない。",
    photos: 4,
  },
  { kind: "expense", at: "2026-10-10T12:10", place: "fushimi", category: "food", amount: 1480 },
  {
    kind: "entry",
    at: "2026-10-10T15:30",
    place: "kiyomizu",
    note: "舞台からの紅葉は、まだ色づきはじめ。",
    photos: 6,
  },
  { kind: "expense", at: "2026-10-10T15:45", place: "kiyomizu", category: "sightseeing", amount: 500 },
  { kind: "expense", at: "2026-10-10T18:30", place: "yado", category: "accommodation", amount: 14800 },
  { kind: "entry", at: "2026-10-11T09:10", place: "nishiki", note: "だし巻きと漬物を食べ歩き。", photos: 3 },
  { kind: "expense", at: "2026-10-11T10:30", place: "nishiki", category: "shopping", amount: 3600 },
];

const VIEWS = ["タイムライン", "場所", "予算"] as const;
type View = (typeof VIEWS)[number];

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const yen = (value: number) => `¥${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const timeOf = (at: string) => at.slice(11, 16);
const placeName = (id: PlaceId) => PLACES.find((place) => place.id === id)?.name ?? "";
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

// 新しい日が上、同じ日の中も新しい順（アプリのタイムラインと同じ並び）
const DAYS = [...new Set(RECORDS.map((record) => record.at.slice(0, 10)))]
  .sort()
  .reverse()
  .map((date) => ({
    date,
    records: RECORDS.filter((record) => record.at.startsWith(date)).sort((a, b) => (a.at < b.at ? 1 : -1)),
  }));

const BY_PLACE = PLACES.map((place) => {
  const entries = ENTRIES.filter((entry) => entry.place === place.id);
  const expenses = EXPENSES.filter((expense) => expense.place === place.id);
  return {
    ...place,
    entries: entries.length,
    photos: entries.reduce((total, entry) => total + entry.photos, 0),
    expenses: expenses.length,
    spent: sum(expenses),
  };
});

const BY_CATEGORY = CATEGORIES.map((category) => ({
  ...category,
  spent: sum(EXPENSES.filter((expense) => expense.category === category.id)),
}));

function PinIcon({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: 装飾。隣に場所の名前がある
    <svg viewBox="0 0 12 14" className={className} fill="currentColor" aria-hidden>
      <path d="M6 0a4.6 4.6 0 0 0-4.6 4.6C1.4 8 6 14 6 14s4.6-6 4.6-9.4A4.6 4.6 0 0 0 6 0Zm0 6.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
    </svg>
  );
}

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

/** 見方を切り替えたときと、画面に入ったときに、行を順に出す */
function Row({
  as: Tag = motion.li,
  index,
  active,
  className,
  children,
}: {
  as?: typeof motion.li | typeof motion.div;
  index: number;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
    >
      {children}
    </Tag>
  );
}

const ROW = "border-b border-[#BEC9C6]/60";
// 行の上下の余白。行の多いタイムラインは詰め、場所と予算は広めに取る
const TIGHT = "py-[clamp(0.3rem,1.05cqh,0.6rem)]";
const LOOSE = "py-[clamp(0.45rem,2.1cqh,1.1rem)]";
const MUTED = "text-[#3F4947]/80";

function TimelineView({ active }: { active: boolean }) {
  let index = 0;
  return (
    <div>
      {DAYS.map((day) => (
        <section key={day.date} className="mt-[clamp(0.35rem,1.4cqh,0.8rem)] first:mt-0">
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
                <span className="min-w-0">
                  <span className="flex min-w-0 items-baseline gap-x-[0.6em]">
                    {isExpense(record) && (
                      <span className="shrink-0 font-medium text-[#7C5800]">{categoryLabel(record.category)}</span>
                    )}
                    <span className={cn("flex min-w-0 items-baseline gap-x-[0.25em]", isExpense(record) ? MUTED : "")}>
                      <PinIcon className="h-[0.78em] w-[0.67em] shrink-0 translate-y-[0.06em] text-[#006A60]" />
                      <span className={cn("truncate", isEntry(record) && "font-medium")}>
                        {placeName(record.place)}
                      </span>
                    </span>
                  </span>
                  {isEntry(record) && <span className={cn("block truncate text-[0.9em]", MUTED)}>{record.note}</span>}
                </span>
                {isEntry(record) ? (
                  <span className={cn("tabular-nums text-[0.82em]", MUTED)}>写真 {record.photos}枚</span>
                ) : (
                  <span className="tabular-nums font-semibold">{yen(record.amount)}</span>
                )}
              </Row>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function PlaceView({ active }: { active: boolean }) {
  return (
    <ul>
      {BY_PLACE.map((place, i) => (
        <Row
          key={place.id}
          index={i}
          active={active}
          className={cn(ROW, LOOSE, "grid grid-cols-[auto_1fr_auto] items-baseline gap-x-[0.6em]")}
        >
          <PinIcon className="h-[0.95em] w-[0.82em] translate-y-[0.1em] text-[#006A60]" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{place.name}</span>
            <span className={cn("block text-[0.86em]", MUTED)}>
              {place.entries > 0 ? `日記 ${place.entries}件 ・ 写真 ${place.photos}枚` : "日記なし"}
            </span>
          </span>
          <span className="text-right">
            <span className="tabular-nums block font-semibold">{yen(place.spent)}</span>
            <span className={cn("block text-[0.86em]", MUTED)}>支出 {place.expenses}件</span>
          </span>
        </Row>
      ))}
    </ul>
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
            日記 {ENTRIES.length} ・ 場所 {PLACES.length} ・ 写真{" "}
            {ENTRIES.reduce((total, entry) => total + entry.photos, 0)}
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
        {view === "タイムライン" && <TimelineView active={active} />}
        {view === "場所" && <PlaceView active={active} />}
        {view === "予算" && <BudgetView active={active} />}
      </div>

      <DemoTag className="mt-3 text-[#161D1C]/45" hint="同じ記録を、3 つの見方で" />
    </div>
  );
}
