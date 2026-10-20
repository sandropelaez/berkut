// Berkut design system primitives (Claude Design: "Berkut"). Keep in step with
// the system's components/bundle.js: same names, states and markup.
import type { ButtonHTMLAttributes, ReactNode } from "react";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

// ---------------------------------------------------------------------------
// Icons: 24px grid, 1.75 round stroke; the stat glyphs are solid.

type IconProps = { className?: string };

function Line({ className = "h-6 w-6", children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function Solid({ className = "h-5 w-5", children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

export const FlameIcon = (p: IconProps) => <Solid {...p}><path d="M12.5 2c.6 3.6 5.5 6.2 5.5 11.6A6 6 0 0 1 6 13.8c0-2.9 1.6-4.9 3.2-6.1-.1 2.2.9 3.7 2.4 4.2-.6-3.4-.2-6.8.9-9.9Z" /></Solid>;
export const BoltIcon = (p: IconProps) => <Solid {...p}><path d="M13.5 2 5 13.5h6L10 22l9-12h-6.2L13.5 2Z" /></Solid>;
export const StarIcon = (p: IconProps) => <Solid {...p}><path d="M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.6l-5.6 3.2 1.3-6.2L3 9.3l6.3-.7L12 2.8Z" /></Solid>;
export const CheckIcon = ({ className = "h-5 w-5" }: IconProps) => <Line className={className}><path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth={2.5} /></Line>;
export const CrossIcon = ({ className = "h-5 w-5" }: IconProps) => <Line className={className}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" strokeWidth={2.5} /></Line>;
export const LockIcon = (p: IconProps) => <Line {...p}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></Line>;
export const HomeIcon = (p: IconProps) => <Line {...p}><path d="M3.5 11 12 3.5 20.5 11M6 9v11h12V9" /></Line>;
export const ReviewIcon = (p: IconProps) => <Line {...p}><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5" /></Line>;
export const RepeatIcon = (p: IconProps) => <Line {...p}><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4 9.4M4 4.5v4.9h4.9" /></Line>;
export const TrophyIcon = (p: IconProps) => <Line {...p}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" /></Line>;
export const UserIcon = (p: IconProps) => <Line {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Line>;
export const SettingsIcon = (p: IconProps) => <Line {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></Line>;
export const ShieldIcon = (p: IconProps) => <Line {...p}><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z" /></Line>;
export const SpeakerIcon = (p: IconProps) => <Line {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5ZM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></Line>;
export const CloseIcon = (p: IconProps) => <Line {...p}><path d="M6 6l12 12M18 6 6 18" /></Line>;
export const BulbIcon = (p: IconProps) => <Line {...p}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></Line>;

// ---------------------------------------------------------------------------
// The sun mark: the flag's disc and 32 tapered rays, in currentColor.

const RAYS = (() => {
  const out: string[] = [];
  for (let i = 0; i < 32; i++) {
    const a = (2 * Math.PI * i) / 32 - Math.PI / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const w = 1.7;
    out.push(
      `M${(48 + 24 * c - s * w).toFixed(2)} ${(48 + 24 * s + c * w).toFixed(2)}` +
        `L${(48 + 46 * c).toFixed(2)} ${(48 + 46 * s).toFixed(2)}` +
        `L${(48 + 24 * c + s * w).toFixed(2)} ${(48 + 24 * s - c * w).toFixed(2)}Z`,
    );
  }
  return out.join("");
})();

export function SunMark({ size = 48, title, className }: { size?: number; title?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={cx("text-berkut-gold", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g fill="currentColor">
        <circle cx="48" cy="48" r="19" />
        <path d={RAYS} />
      </g>
    </svg>
  );
}

/** Full-screen loading state: the sun, breathing. */
export function SunLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3" role="status">
      <SunMark size={56} className="animate-pulse" />
      <span className="text-sm text-berkut-muted">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Qoshqar müiz (ram's horn): the one ornament, as a 14px gold band.

export function Ornament({ id = "orn", className }: { id?: string; className?: string }) {
  const pid = `bk-orn-${id}`;
  return (
    <svg className={cx("block h-3.5 w-full text-berkut-gold", className)} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id={pid} width="28" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M14 13V8.5C14 4.5 9 2.5 6.5 5C4.8 6.7 6 9 8.3 8.5C9.8 8.1 9.4 6.2 8 6.2M14 8.5C14 4.5 19 2.5 21.5 5C23.2 6.7 22 9 19.7 8.5C18.2 8.1 18.6 6.2 20 6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stat chips

// Hearts, gems and XP are paused (see #4); the system keeps their chip styles for when they return.
const CHIP = {
  streak: { Icon: FlameIcon, cls: "bg-berkut-gold-soft text-berkut-gold-ink", label: "day streak" },
} as const;

export function StatChip({ kind, value, className }: { kind: keyof typeof CHIP; value: number | string; className?: string }) {
  const { Icon, cls, label } = CHIP[kind];
  return (
    <span className={cx("chip", cls, className)} title={`${value} ${label}`}>
      <Icon className="h-[18px] w-[18px]" />
      <span>{value}</span>
      <span className="sr-only"> {label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Choice tiles

export type TileState = "idle" | "selected" | "correct" | "wrong" | "dimmed";

/** State of an answer option once the learner has (or hasn't) picked. */
export function optionState(phase: "answering" | "checked", selected: boolean, isCorrect: boolean): TileState {
  if (phase === "answering") return selected ? "selected" : "idle";
  if (isCorrect) return "correct";
  return selected ? "wrong" : "dimmed";
}

// Literal class names so Tailwind keeps them (it can't see `tile-${state}`).
const TILE_CLASS: Record<TileState, string> = {
  idle: "",
  selected: "tile-selected",
  correct: "tile-correct",
  wrong: "tile-wrong",
  dimmed: "tile-dimmed",
};

export function ChoiceTile({
  state = "idle",
  lang,
  className,
  children,
  ...rest
}: { state?: TileState; lang?: "kk" | "en"; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={state === "selected" ? true : undefined}
      className={cx("tile", lang === "kk" && "tile-kk", TILE_CLASS[state], className)}
    >
      {state === "correct" && <CheckIcon />}
      {state === "wrong" && <CrossIcon />}
      <span>{children}</span>
    </button>
  );
}

/** Tappable Kazakh prompt that reads itself aloud. */
export function SpokenPrompt({ onSpeak, children, size = "word" }: { onSpeak: () => void; children: ReactNode; size?: "word" | "sentence" }) {
  return (
    <button
      type="button"
      onClick={onSpeak}
      className="card flex w-full items-center justify-center gap-3 text-center transition hover:bg-berkut-sky-soft/60"
    >
      <span className={cx("font-display font-medium", size === "word" ? "text-[34px] leading-[42px]" : "text-2xl leading-9")}>{children}</span>
      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-berkut-sky-soft text-berkut-sky-ink">
        <SpeakerIcon className="h-5 w-5" />
        <span className="sr-only">Play audio</span>
      </span>
    </button>
  );
}

// Stat tile on the lesson and repeat end screens.
export function ResultStat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-tile p-3 ${highlight ? "bg-berkut-gold text-berkut-on-gold" : "bg-berkut-raised shadow-card"}`}>
      <div className={`text-[11px] font-bold uppercase tracking-[0.1em] ${highlight ? "" : "text-berkut-muted"}`}>{label}</div>
      <div className="font-display text-xl font-semibold tabular-nums mt-1">{value}</div>
    </div>
  );
}
