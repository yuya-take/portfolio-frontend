"use client";

import { MotionConfig, type Variants, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

const container = (delay: number): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: delay } },
});

const rise: Variants = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

/** OS の「視差効果を減らす」に従わせる */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** 行ごとにマスクの下からせり上がる見出し */
export function Lines({
  lines,
  className,
  delay = 0,
  as = "p",
}: {
  lines: string[];
  className?: string;
  delay?: number;
  as?: "h2" | "p";
}) {
  const Tag = motion[as] as typeof motion.p;
  return (
    <Tag className={className} variants={container(delay)} initial="hidden" whileInView="shown" viewport={viewport}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden">
          <motion.span className="block" variants={rise}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** 画面に入ったときに一度だけ、下からふわっと現れるブロック */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
