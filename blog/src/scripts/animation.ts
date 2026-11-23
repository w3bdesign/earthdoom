import {
  animate,
  stagger,
  type AnimationOptions,
  type AnimationPlaybackControlsWithThen,
  type DOMKeyframesDefinition,
} from "motion";

/** Strong ease-out used across the site (matches --ease-out-expo in global.css). */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** One element (or list of elements) and its values in each state. */
export interface TogglePart {
  target: Element | Element[];
  open: DOMKeyframesDefinition;
  closed: DOMKeyframesDefinition;
  /** Seconds between elements in a list: in from the first on open, out from the last on close. */
  stagger?: number;
}

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function timing(part: TogglePart, open: boolean): AnimationOptions {
  const gap = part.stagger;
  if (open) {
    return { duration: 0.28, ease: EASE_OUT_EXPO, delay: gap ? stagger(gap, { startDelay: 0.06 }) : 0 };
  }
  // Closing runs in reverse: staggered lists leave first, everything else follows.
  return gap
    ? { duration: 0.14, ease: "easeIn", delay: stagger(gap, { from: "last" }) }
    : { duration: 0.22, ease: "easeIn", delay: 0.08 };
}

/**
 * Animate a group of parts between an open and a closed state. Each part is
 * described once; both directions and their timing come from the same list.
 *
 * Returns `set(open, instant?)`, which stops anything still running and
 * resolves to `true` when the new animation finishes, or `false` if a later
 * call replaced it first.
 */
export function createToggle(parts: TogglePart[]) {
  let running: AnimationPlaybackControlsWithThen[] = [];
  let generation = 0;

  return async function set(open: boolean, instant = false): Promise<boolean> {
    running.forEach((animation) => animation.stop());
    const id = ++generation;
    const still = instant || reducedMotion.matches;

    running = parts.map((part) =>
      animate(part.target, open ? part.open : part.closed, still ? { duration: 0 } : timing(part, open)),
    );
    if (instant) running.forEach((animation) => animation.complete());

    await Promise.all(running);
    return id === generation;
  };
}
