import type { ReactNode } from "react";

/** The page title, an optional one-line description and page-level actions. */
const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold text-ink md:text-[1.75rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-1 max-w-prose text-sm text-muted">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
