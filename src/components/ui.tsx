// Berkut design system primitives (Claude Design: "Berkut", Turquoise Sky). Keep in
// step with the system's components/index.d.ts and bundle.css: same names, props,
// states and markup. The classes they render live in src/index.css.
import { useId, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import ProgressBar from "./ProgressBar";

export { default as ProgressBar } from "./ProgressBar";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

// ---------------------------------------------------------------------------
// Icons: 24px grid, 2px round stroke (check and cross 2.5); flame, bolt and star are solid.
// chart, users, key, book, flag, list and trend are the admin navigation icons.

export type IconName =
  | "home"
  | "review"
  | "trophy"
  | "user"
  | "settings"
  | "speaker"
  | "check"
  | "cross"
  | "bulb"
  | "lock"
  | "close"
  | "shield"
  | "flame"
  | "bolt"
  | "star"
  | "chart"
  | "users"
  | "key"
  | "book"
  | "flag"
  | "list"
  | "trend";

export const iconNames: IconName[] = [
  "home", "review", "trophy", "user", "settings", "speaker", "check", "cross",
  "bulb", "lock", "close", "shield", "flame", "bolt", "star",
  "chart", "users", "key", "book", "flag", "list", "trend",
];

const STROKE: Partial<Record<IconName, string>> = {
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
  cross: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  speaker: "M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5ZM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11",
  home: "M3.5 11 12 3.5 20.5 11M6 9v11h12V9",
  review: "M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5",
  trophy: "M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3",
  settings: "M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1",
  shield: "M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z",
  chart: "M4 20h16M7 16.5V12M12 16.5V7M17 16.5v-6",
  users: "M12.5 8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM2.5 20.5a6.5 6.5 0 0 1 13 0M15.5 4.7a3.5 3.5 0 0 1 0 6.6M18 14.2a6.5 6.5 0 0 1 3.5 6.3",
  key: "M12.5 15a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM11.2 11.8 20 3M16.5 6.5l3 3M14 9.2l2 2",
  book: "M12 6.5C10.4 5 7.9 4.5 4 4.5v14c3.9 0 6.4.5 8 2 1.6-1.5 4.1-2 8-2v-14c-3.9 0-6.4.5-8 2ZM12 6.5v14",
  flag: "M5 21V3.5M5 4h12.5L15 8.5l2.5 4.5H5",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
};

const SOLID: Partial<Record<IconName, string>> = {
  flame: "M12.5 2c.6 3.6 5.5 6.2 5.5 11.6A6 6 0 0 1 6 13.8c0-2.9 1.6-4.9 3.2-6.1-.1 2.2.9 3.7 2.4 4.2-.6-3.4-.2-6.8.9-9.9Z",
  bolt: "M13.5 2 5 13.5h6L10 22l9-12h-6.2L13.5 2Z",
  star: "M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.6l-5.6 3.2 1.3-6.2L3 9.3l6.3-.7L12 2.8Z",
};

export interface IconProps {
  name: IconName;
  size?: number;
  title?: string;
  className?: string;
}

/** Decorative by default; pass `title` when the icon carries meaning alone. */
export function Icon({ name, size = 24, title, className }: IconProps) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
  const solid = SOLID[name];
  if (solid) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={cx("block flex-none", className)} fill="currentColor" {...a11y}>
        <path d={solid} />
      </svg>
    );
  }
  const body =
    name === "lock" ? (
      <>
        <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      </>
    ) : name === "user" ? (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ) : name === "settings" ? (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d={STROKE.settings} />
      </>
    ) : (
      <path d={STROKE[name] ?? ""} />
    );
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cx("block flex-none", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "check" || name === "cross" ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {body}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Logo: the soaring golden eagle. Turquoise wings, sun-gold head; the body is
// turquoise-ink in Day and light ink in Night. Wide (100:62): `size` is its height.
// Never recolour, outline, rotate, flip or crop it, or use it under 24px tall.

export interface LogoProps {
  size?: number;
  wordmark?: boolean;
  title?: string;
}

export function Logo({ size = 36, wordmark = false, title = "Berkut" }: LogoProps) {
  const body = "fill-berkut-turquoise-ink dark:fill-berkut-ink";
  const mark = (
    <svg
      viewBox="0 22 100 62"
      width={Math.round((size * 100) / 62)}
      height={size}
      className="block flex-none"
      role={wordmark ? undefined : "img"}
      aria-label={wordmark ? undefined : title}
      aria-hidden={wordmark ? true : undefined}
    >
      <g className="fill-berkut-turquoise stroke-berkut-turquoise" strokeWidth={1.2} strokeLinejoin="round">
        <path d="M44 44 C32 38 18 34 8 35 L2 38 L11 41 L1 44 L11 46 L3 50 L13 50 L7 56 L17 54 C26 56 36 58 44 58 Z" />
        <path d="M56 44 C68 38 82 34 92 35 L98 38 L89 41 L99 44 L89 46 L97 50 L87 50 L93 56 L83 54 C74 56 64 58 56 58 Z" />
      </g>
      <path className={body} d="M44 66 L39 79 L44 77 L47 81 L50 77 L53 81 L56 77 L61 79 L56 66 Z" />
      <path className={body} d="M50 36 C55 36 57 41 56 46 C58 54 57 62 55 68 L45 68 C43 62 42 54 44 46 C43 41 45 36 50 36 Z" />
      <path className="fill-berkut-sun" d="M45 42 C44 34 47 28 52 28 C55 28 57 28.5 59 30.5 L58.6 37 C57.6 39.5 55.5 42 53 44 Z" />
      <path className="fill-berkut-ink" d="M59 30.5 L62.5 32 C64.5 33.3 64.8 36.2 63.4 38 C62.6 36.8 60.8 36.2 58.6 36.6 C58.6 34.5 58.8 32.5 59 30.5 Z" />
    </svg>
  );
  if (!wordmark) return mark;
  return (
    <span
      className="inline-flex items-center gap-[0.5em] font-semibold tracking-[-0.02em] text-berkut-ink"
      style={{ fontSize: Math.round(size * 0.72) }}
    >
      {mark}
      <span>{title}</span>
    </span>
  );
}

/** Loading state: the mark, breathing. */
export function Loader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3" role="status">
      <span className="animate-pulse" aria-hidden="true">
        <Logo size={48} />
      </span>
      <span className="text-small text-berkut-ink-muted">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Buttons

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "reward";
  size?: "md" | "lg";
  block?: boolean;
  icon?: IconName;
  children: ReactNode;
}

// Literal class names so Tailwind keeps them (it can't see `btn-${variant}`).
const BUTTON_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  reward: "btn-reward",
};

/** One primary per screen; `reward` (sun) only for streaks and rewards. */
export function Button({ variant = "primary", size = "md", block = false, icon, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(BUTTON_CLASS[variant], size === "lg" && "btn-lg", block && "btn-block", className)}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  tone?: "neutral" | "accent";
}

export function IconButton({ icon, label, tone = "neutral", className, ...rest }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} {...rest} className={cx("iconbtn", tone === "accent" && "iconbtn-accent", className)}>
      <Icon name={icon} size={20} />
    </button>
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

const TILE_CLASS: Record<TileState, string> = {
  idle: "",
  selected: "tile-selected",
  correct: "tile-correct",
  wrong: "tile-wrong",
  dimmed: "tile-dimmed",
};

export interface ChoiceTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state?: TileState;
  align?: "center" | "start";
  children: ReactNode;
}

/** State is never colour alone: correct carries a check, wrong a cross. */
export function ChoiceTile({ state = "idle", align = "center", className, children, ...rest }: ChoiceTileProps) {
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={state === "selected" ? true : undefined}
      className={cx("tile", TILE_CLASS[state], align === "start" && "tile-start", className)}
    >
      {state === "correct" && <Icon name="check" size={18} />}
      {state === "wrong" && <Icon name="cross" size={18} />}
      <span>{children}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Lesson pieces

export interface SpokenPromptProps {
  /** Kazakh, already in the learner's script. */
  text: string;
  transliteration?: string;
  instruction?: string;
  size?: "word" | "sentence";
  onSpeak?: () => void;
}

/** The Kazakh prompt at the top of an exercise: always the loudest thing on screen. */
export function SpokenPrompt({ text, transliteration, instruction, size = "word", onSpeak }: SpokenPromptProps) {
  return (
    <div className="flex flex-col gap-2">
      {instruction && <div className="text-prompt text-berkut-ink-muted">{instruction}</div>}
      <div className="flex items-center gap-3.5">
        <span lang="kk" className={cx("min-w-0 break-words text-berkut-ink", size === "word" ? "text-display-word" : "text-display-sentence")}>
          {text}
        </span>
        <IconButton icon="speaker" label="Play audio" tone="accent" onClick={onSpeak} />
      </div>
      {transliteration && <div className="text-translit text-berkut-ink-muted">{transliteration}</div>}
    </div>
  );
}

export interface LessonHeaderProps {
  step: number;
  total: number;
  onClose?: () => void;
}

export function LessonHeader({ step, total, onClose }: LessonHeaderProps) {
  return (
    <div className="flex items-center gap-3.5">
      <IconButton icon="close" label="Close lesson" onClick={onClose} />
      <div className="flex-1">
        <ProgressBar value={step} max={total} size="sm" />
      </div>
      <span className="text-small font-semibold tabular-nums text-berkut-ink-muted">
        {step}/{total}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small pieces

export interface StatChipProps {
  value: number | string;
  unit?: string;
  label?: string;
}

/** The streak pill: a sun flame with the count in sun-ink on sun-soft. */
export function StatChip({ value, unit = "days", label = "day streak" }: StatChipProps) {
  return (
    <span className="chip bg-berkut-sun-soft text-berkut-sun-ink" title={`${value} ${label}`}>
      <Icon name="flame" size={16} className="text-berkut-sun" />
      <span>
        {value}
        {unit ? ` ${unit}` : ""}
      </span>
      <span className="sr-only"> {label}</span>
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Field({ label, id, className, ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label className={cx("flex flex-col gap-2", className)} htmlFor={inputId}>
      {label && <span className="text-small text-berkut-ink-muted">{label}</span>}
      <input id={inputId} className="field" {...rest} />
    </label>
  );
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div {...rest} className={cx("card", className)}>
      {children}
    </div>
  );
}
