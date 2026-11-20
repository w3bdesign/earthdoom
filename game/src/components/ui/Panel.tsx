import type { ReactNode } from "react";

interface PanelProps {
  title?: ReactNode;
  /** Short text next to the title, such as a total */
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Remove body padding, for tables and lists that run edge to edge */
  flush?: boolean;
}

/** A titled surface that groups related content. */
const Panel = ({
  title,
  meta,
  actions,
  children,
  className = "",
  flush = false,
}: PanelProps) => (
  <section
    className={`flex flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-panel ${className}`}
  >
    {(title || actions) && (
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="flex items-baseline gap-2 text-base font-semibold text-ink">
          {title}
          {meta && (
            <span className="text-sm font-normal text-muted">{meta}</span>
          )}
        </h2>
        {actions}
      </header>
    )}
    <div className={`flex-1 ${flush ? "" : "p-4"}`}>{children}</div>
  </section>
);

export default Panel;
