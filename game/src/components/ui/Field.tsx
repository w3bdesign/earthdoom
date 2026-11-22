import type { ReactNode } from "react";

export const INPUT_CLASS =
  "h-10 w-full rounded-md border border-field bg-sunken px-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-accent focus:outline-hidden focus-visible:outline-hidden focus:ring-2 focus:ring-accent/30 disabled:opacity-60 read-only:bg-raised read-only:text-muted";

/** A label above a form control, with optional hint text. */
const Field = ({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-muted">{hint}</p>}
  </div>
);

export default Field;
