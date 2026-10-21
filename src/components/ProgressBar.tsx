export interface ProgressBarProps {
  value: number;
  max: number;
  tone?: "turquoise" | "success" | "sun";
  size?: "md" | "sm";
  label?: string;
}

// Literal class names so Tailwind keeps them.
const FILL: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  turquoise: "bg-berkut-turquoise",
  success: "bg-berkut-success",
  sun: "bg-berkut-sun",
};

/** Turquoise for lesson and unit progress, success for completion summaries, sun for reward goals. */
export default function ProgressBar({ value, max, tone = "turquoise", size = "md", label = "Lesson progress" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div
      className={`${size === "sm" ? "h-1.5" : "h-2"} w-full overflow-hidden rounded-full bg-berkut-surface`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className={`h-full rounded-full ${FILL[tone]} transition-[width] duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}
