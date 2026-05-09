export default function ProgressBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="h-3 w-full rounded-full bg-berkut-border dark:bg-berkut-border-dark overflow-hidden">
      <div
        className="h-full rounded-full bg-berkut-success transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
