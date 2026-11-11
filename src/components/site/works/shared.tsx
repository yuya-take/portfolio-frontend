export type Rgb = readonly [number, number, number];

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export const mixRgb = (from: Rgb, to: Rgb, t: number): string => {
  const k = Math.min(1, Math.max(0, t));
  return `rgb(${from.map((channel, i) => Math.round(channel + (to[i] - channel) * k)).join(" ")})`;
};

/** デモが実際の画面ではなく、考え方の再現であることを示す一行 */
export function DemoTag({ className, hint }: { className?: string; hint: string }) {
  return (
    <p
      className={cn(
        "flex items-center justify-between gap-4 text-[clamp(10.5px,1.05cqw,13px)] tracking-[0.06em]",
        className,
      )}
    >
      <span>コンセプトデモ</span>
      <span>{hint}</span>
    </p>
  );
}

/** 選択肢が横に並ぶ切り替え */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  activeClassName,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
  activeClassName: string;
}) {
  return (
    <fieldset className={cn("flex min-w-0 items-center gap-0.5 rounded-full p-0.5", className)}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-2.5 py-1.5 text-[clamp(11px,1.12cqw,14.5px)] leading-none tracking-[0.08em] transition-colors duration-300",
            option === value ? activeClassName : "opacity-55 hover:opacity-100",
          )}
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}
