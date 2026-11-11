"use client";

import type { ProjectSlug } from "@/lib/site";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { DewVisual } from "./works/dew-visual";
import { InsaporireVisual } from "./works/insaporire-visual";
import { LatentVisual } from "./works/latent-visual";
import { ScoreScreenVisual } from "./works/scorescreen-visual";

const visuals: Record<ProjectSlug, (props: { active: boolean }) => React.ReactNode> = {
  scorescreen: ScoreScreenVisual,
  latent: LatentVisual,
  dew: DewVisual,
  insaporire: InsaporireVisual,
};

/** 案件ごとのコンセプトデモ。画面に入っている間だけ動かす。 */
export function ProjectVisual({ slug }: { slug: ProjectSlug }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.25 });
  const Visual = visuals[slug];

  return (
    <div
      ref={ref}
      className="relative h-[min(128vw,560px)] overflow-hidden rounded-2xl bg-card-panel [container-type:size] md:h-[620px] lg:h-full lg:min-h-[620px]"
    >
      <Visual active={active} />
    </div>
  );
}
