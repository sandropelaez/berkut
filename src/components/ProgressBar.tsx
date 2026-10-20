export default function ProgressBar({
  value,
  max,
  tone = "sky",
  label = "Lesson progress",
}: {
  value: number;
  max: number;
  tone?: "sky" | "success" | "gold";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const fill = tone === "success" ? "bg-berkut-success" : tone === "gold" ? "bg-berkut-gold" : "bg-berkut-sky";
  return (
    <div
      className="h-3 w-full rounded-full bg-berkut-sunk overflow-hidden"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className={`h-full rounded-full ${fill} transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}
