import type { ReactNode } from "react";
import type { IconType } from "react-icons";

/** Shared width so buttons and statuses line up in a table's action column. */
export const ACTION_WIDTH = "min-w-[8rem]";

const TONES = {
  friendly: "border-friendly/35 bg-friendly/10 text-friendly",
  caution: "border-caution/40 bg-caution/10 text-caution",
} as const;

/**
 * A status shown in place of an action button ("Done", "5 ticks left").
 * Same size and shape as a medium Button, but tinted and not clickable.
 */
const ActionStatus = ({
  tone,
  icon: Icon,
  children,
}: {
  tone: keyof typeof TONES;
  icon?: IconType;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm font-semibold ${ACTION_WIDTH} ${TONES[tone]}`}
  >
    {Icon && <Icon aria-hidden className="h-4 w-4 shrink-0" />}
    {children}
  </span>
);

export default ActionStatus;
