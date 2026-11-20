import type { FC } from "react";
import type { PaPlayer } from "@/types/player";

import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Panel from "@/components/ui/Panel";
import { BUILDINGS } from "@/components/features/Construct/constants/BUILDINGS";
import { BUILDINGS as RESEARCH } from "@/components/features/Research/constants/RESEARCH";
import { PRODUCTION } from "@/components/features/Production/constants/PRODUCTION";

import { formatNumber } from "@/utils/functions";

interface Job {
  key: string;
  kind: "Construction" | "Research" | "Production";
  name: string;
  ticks: number;
}

/**
 * Everything the player has started that hasn't finished yet.
 * Buildings and research count down from their ETA to 1 (done); units in production
 * store the amount and a separate ETA field.
 */
export const getJobs = (paPlayer: PaPlayer): Job[] => {
  const started = [
    ...BUILDINGS.map((b) => ({ ...b, kind: "Construction" as const })),
    ...RESEARCH.map((r) => ({ ...r, kind: "Research" as const })),
  ]
    .filter((item) => Number(paPlayer[item.buildingFieldName]) >= 2)
    .map((item) => ({
      key: item.buildingFieldName,
      kind: item.kind,
      name: item.buildingName,
      ticks: Number(paPlayer[item.buildingFieldName]),
    }));

  const training = PRODUCTION.filter(
    (unit) => Number(paPlayer[unit.buildingFieldName]) > 0,
  ).map((unit) => ({
    key: unit.buildingFieldName,
    kind: "Production" as const,
    name: `${formatNumber(Number(paPlayer[unit.buildingFieldName]))} × ${unit.buildingName}`,
    ticks: Number(paPlayer[unit.buildingFieldNameETA]),
  }));

  return [...started, ...training].sort((a, b) => a.ticks - b.ticks);
};

/** A list of construction, research and production that is still running. */
const InProgress: FC<{ paPlayer: PaPlayer }> = ({ paPlayer }) => {
  const jobs = getJobs(paPlayer);

  return (
    <Panel title="In progress" flush className="h-full">
      {jobs.length === 0 ? (
        <p className="px-4 py-4 text-sm text-muted">
          Nothing is being built, researched or trained.{" "}
          <Link
            href="/construct"
            className="font-semibold text-accent hover:underline"
          >
            Construct
          </Link>{" "}
          or{" "}
          <Link
            href="/production"
            className="font-semibold text-accent hover:underline"
          >
            train units
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {jobs.map((job) => (
            <li
              key={job.key}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {job.name}
                </p>
                <p className="text-xs text-muted">{job.kind}</p>
              </div>
              <Badge tone="caution">
                {job.ticks} {job.ticks === 1 ? "tick" : "ticks"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default InProgress;
