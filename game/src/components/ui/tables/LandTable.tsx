import type { FC } from "react";
import type { PaPlayer } from "@/components/features/Military/Military";

import Link from "next/link";

import Panel from "@/components/ui/Panel";

import { formatNumber } from "@/utils/functions";

interface LandTableProps {
  paPlayer: PaPlayer;
}

/** How the player's land is used: houses, mines and undeveloped, as a split bar and a legend. */
const LandTable: FC<LandTableProps> = ({ paPlayer }) => {
  const parts = [
    { label: "Houses", value: paPlayer.asteroid_crystal, color: "bg-credits" },
    { label: "Mines", value: paPlayer.asteroid_metal, color: "bg-titanium" },
    { label: "Undeveloped", value: paPlayer.ui_roids, color: "bg-line-strong" },
  ];
  const roidCount = parts.reduce((sum, part) => sum + part.value, 0);

  return (
    <Panel
      className="h-full"
      title="Land"
      meta={`${formatNumber(roidCount)} total`}
      actions={
        paPlayer.ui_roids > 0 ? (
          <Link
            href="/resources"
            className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            Develop
          </Link>
        ) : undefined
      }
    >
      {roidCount > 0 && (
        <div
          aria-hidden
          className="mb-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full"
        >
          {parts
            .filter((part) => part.value > 0)
            .map((part) => (
              <div
                key={part.label}
                className={part.color}
                style={{ flexGrow: part.value }}
              />
            ))}
        </div>
      )}
      <dl aria-label="Land" className="grid grid-cols-3 gap-2">
        {parts.map((part) => (
          <div key={part.label}>
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${part.color}`}
              />
              {part.label}
            </dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNumber(part.value)}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export default LandTable;
