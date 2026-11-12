"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DemoTag, cn } from "./shared";

/**
 * yuya-claude-code：入れる pack を選ぶと、依存する pack も一緒に入る。
 * 依存関係と中身の数は、配布元の packs/<pack>/ に合わせている。
 */

type PackName = "core" | "review" | "dev-flow" | "python" | "frontend" | "rust";

type Pack = {
  name: PackName;
  needs: PackName[];
  items: string;
  skills: number;
  agents: number;
  rules: number;
  hooks: number;
};

const PACKS: Pack[] = [
  { name: "core", needs: [], items: "/setup /explain /skill-create", skills: 3, agents: 0, rules: 1, hooks: 0 },
  {
    name: "review",
    needs: ["core"],
    items: "/rv /refactor-clean、reviewer agent",
    skills: 2,
    agents: 9,
    rules: 1,
    hooks: 0,
  },
  {
    name: "dev-flow",
    needs: ["core", "review"],
    items: "/issue-create /issue-refine /dev /orchestrate /pr /sync",
    skills: 6,
    agents: 0,
    rules: 0,
    hooks: 0,
  },
  {
    name: "python",
    needs: ["core"],
    items: "/troubleshooting、ruff の自動フォーマット",
    skills: 1,
    agents: 0,
    rules: 4,
    hooks: 1,
  },
  {
    name: "frontend",
    needs: ["core"],
    items: "/unslop-design、biome の自動フォーマット",
    skills: 1,
    agents: 0,
    rules: 2,
    hooks: 1,
  },
  {
    name: "rust",
    needs: ["core"],
    items: "Rust の rules、cargo の permissions",
    skills: 0,
    agents: 0,
    rules: 1,
    hooks: 0,
  },
];

const INSTALL = "curl -fsSL https://raw.githubusercontent.com/yuya-take/yuya-claude-code/main/install.sh | bash";
const COUNTED = ["skills", "agents", "rules", "hooks"] as const;

/** 選んだ pack に、依存する pack をたどって足す */
const withNeeds = (chosen: PackName[]) => {
  const all = new Set<PackName>();
  const add = (name: PackName) => {
    if (all.has(name)) return;
    all.add(name);
    for (const need of PACKS.find((pack) => pack.name === name)?.needs ?? []) add(need);
  };
  chosen.forEach(add);
  return all;
};

export function ClaudeCodeVisual({ active }: { active: boolean }) {
  const [chosen, setChosen] = useState<PackName[]>(["dev-flow"]);
  const [copied, setCopied] = useState(false);

  const installed = withNeeds(chosen);
  // install.sh の一覧と同じ順に並べる
  const ordered = PACKS.filter((pack) => chosen.includes(pack.name)).map((pack) => pack.name);
  const option = ordered.length > 0 ? ` -s -- --packs ${ordered.join(",")}` : "";
  const command = INSTALL + option;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const toggle = (name: PackName) => {
    setCopied(false);
    setChosen((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // クリップボードが使えない環境では、表示されているコマンドを手で選んでもらう
    }
  };

  return (
    <div className="flex h-full flex-col justify-between p-[clamp(1.1rem,4.5cqw,2.75rem)] text-[rgb(228_232_238)]">
      <div className="flex items-end justify-between gap-3">
        <span className="font-mono text-[clamp(1rem,2.3cqw,1.4rem)] font-semibold leading-none">install.sh</span>
        <p className="text-right text-[clamp(11px,1.12cqw,14.5px)] tracking-[0.1em] text-[rgb(228_232_238/0.6)]">
          入れる pack を選ぶ
        </p>
      </div>

      <ul className="border-t border-[rgb(228_232_238/0.75)] text-[clamp(12px,2.1cqw,16.5px)]">
        {PACKS.map((pack, i) => {
          const picked = chosen.includes(pack.name);
          const needed = !picked && installed.has(pack.name);
          return (
            <motion.li
              key={pack.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07 }}
            >
              <button
                type="button"
                aria-pressed={picked}
                onClick={() => toggle(pack.name)}
                className="group grid w-full grid-cols-[auto_1fr] items-start gap-x-[0.9em] border-b border-[rgb(228_232_238/0.12)] py-[clamp(0.35rem,1.4cqh,0.8rem)] [@container(min-width:520px)]:py-[clamp(0.6rem,2.7cqh,1.3rem)] text-left leading-[1.45] [@container(min-width:520px)]:leading-[1.55] [@container(min-width:520px)]:grid-cols-[auto_12.5em_1fr]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-[0.28em] grid h-[1em] w-[1em] place-items-center rounded-[3px] border transition-colors duration-300",
                    picked
                      ? "border-[rgb(150_190_255)] bg-[rgb(150_190_255)]"
                      : needed
                        ? "border-[rgb(150_190_255/0.8)]"
                        : "border-[rgb(228_232_238/0.4)] group-hover:border-[rgb(228_232_238/0.8)]",
                  )}
                >
                  {picked && (
                    // biome-ignore lint/a11y/noSvgWithoutTitle: 装飾。状態は aria-pressed で伝えている
                    <svg viewBox="0 0 10 10" className="h-[0.62em] w-[0.62em]" fill="none" stroke="rgb(20 24 32)">
                      <path d="M1.5 5.2l2.4 2.4 4.6-5" strokeWidth="1.6" />
                    </svg>
                  )}
                  {needed && <span className="h-[0.36em] w-[0.36em] rounded-[1px] bg-[rgb(150_190_255)]" />}
                </span>
                <span className="flex flex-wrap items-baseline gap-x-[0.7em]">
                  <span
                    className={cn(
                      "font-mono font-medium transition-colors duration-300",
                      !installed.has(pack.name) && "text-[rgb(228_232_238/0.6)]",
                    )}
                  >
                    {pack.name}
                  </span>
                  {needed && (
                    <motion.span
                      className="text-[0.76em] text-[rgb(150_190_255)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      依存で追加
                    </motion.span>
                  )}
                </span>
                <span
                  className={cn(
                    "col-start-2 text-[0.82em] transition-colors duration-300 [@container(min-width:520px)]:col-start-3 [@container(min-width:520px)]:pt-[0.12em]",
                    installed.has(pack.name) ? "text-[rgb(228_232_238/0.72)]" : "text-[rgb(228_232_238/0.4)]",
                  )}
                >
                  {pack.items}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <div>
        <p className="break-all font-mono text-[clamp(10.5px,1.72cqw,13.5px)] leading-[1.6] text-[rgb(228_232_238/0.72)]">
          {INSTALL}
          <span className="text-[rgb(150_190_255)]">{option}</span>
        </p>
        <div className="mb-[clamp(0.6rem,2.4cqh,1rem)] mt-[clamp(0.4rem,1.6cqh,0.9rem)] flex items-center justify-between gap-3 text-[clamp(11px,1.5cqw,14px)]">
          {ordered.length > 0 ? (
            <dl className="flex flex-wrap gap-x-[0.9em] text-[rgb(228_232_238/0.6)]">
              {COUNTED.map((kind) => (
                <div key={kind} className="flex items-baseline gap-x-[0.4em]">
                  <dt>{kind}</dt>
                  <dd className="tabular-nums font-medium text-[rgb(228_232_238)]">
                    {PACKS.reduce((sum, pack) => sum + (installed.has(pack.name) ? pack[kind] : 0), 0)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-[rgb(228_232_238/0.6)]">
              指定しないときは core・review・dev-flow と、検出した言語の pack が入ります
            </p>
          )}
          <button
            type="button"
            onClick={copy}
            className="shrink-0 border border-[rgb(228_232_238/0.4)] px-3 py-1.5 leading-none transition-colors duration-300 hover:bg-[rgb(228_232_238)] hover:text-[rgb(20_24_32)]"
          >
            <span aria-live="polite">
              {copied ? (
                "コピーしました"
              ) : (
                <>
                  <span className="sr-only">コマンドを</span>コピー
                </>
              )}
            </span>
          </button>
        </div>
        <DemoTag className="text-[rgb(228_232_238/0.45)]" hint="依存する pack は自動で入ります" />
      </div>
    </div>
  );
}
