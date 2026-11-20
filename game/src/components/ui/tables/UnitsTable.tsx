import type { FC } from "react";
import type { PaPlayer } from "@/components/features/Military/Military";

import Panel from "@/components/ui/Panel";
import StatList from "@/components/ui/StatList";

import { formatNumber, getShipCount } from "@/utils/functions";

interface UnitsTableProps {
  paPlayer: PaPlayer;
}

export const SHIPS = [
  { label: "Astropods", field: "astropods" },
  { label: "Infinitys", field: "infinitys" },
  { label: "Wraiths", field: "wraiths" },
  { label: "Warfrigs", field: "warfrigs" },
  { label: "Destroyers", field: "destroyers" },
  { label: "Scorpions", field: "scorpions" },
] as const;

/** The player's ships, with the total in the title. */
const UnitsTable: FC<UnitsTableProps> = ({ paPlayer }) => (
  <Panel title="Units" meta={`${formatNumber(getShipCount(paPlayer))} total`}>
    <StatList
      label="Units"
      stats={SHIPS.map(({ label, field }) => ({
        label,
        value: Number(paPlayer[field]),
      }))}
    />
  </Panel>
);

export default UnitsTable;
