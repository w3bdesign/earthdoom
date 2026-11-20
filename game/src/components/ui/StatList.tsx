import { formatNumber } from "@/utils/functions";

export interface Stat {
  label: string;
  value: number;
}

/** Label and value pairs with right-aligned numbers. */
const StatList = ({ stats, label }: { stats: Stat[]; label?: string }) => (
  <dl aria-label={label} className="divide-y divide-line">
    {stats.map(({ label: name, value }) => (
      <div
        key={name}
        className="flex items-baseline justify-between gap-4 py-2 first:pt-0 last:pb-0"
      >
        <dt className="text-sm text-muted">{name}</dt>
        <dd
          className={`text-sm font-medium tabular-nums ${value === 0 ? "text-muted" : "text-ink"}`}
        >
          {formatNumber(value)}
        </dd>
      </div>
    ))}
  </dl>
);

export default StatList;
