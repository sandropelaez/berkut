import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * The lesson player's bottom bar is the one place a learner's thumb goes to act.
 * Exercises with their own button (Check) render it here through a portal, so it
 * stays on screen however tall the exercise is, instead of sitting below the fold.
 */
export const LessonActionSlot = createContext<HTMLElement | null>(null);

export function LessonAction({ children }: { children: ReactNode }) {
  const slot = useContext(LessonActionSlot);
  // Outside the player (admin preview, tests) the action stays inline.
  if (!slot) return <>{children}</>;
  return createPortal(children, slot);
}
