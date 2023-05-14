import { type FC } from "react";

import type { PaPlayer } from "../features/Production/Production";

import { DataTable } from "@/components/ui/common";

interface LandTableProps {
  paPlayer: PaPlayer;
}

const UnitsTable: FC<LandTableProps> = ({ paPlayer }) => {
  let shipCount = 0;

  shipCount =
    paPlayer.astropods +
    paPlayer.infinitys +
    paPlayer.warfrigs +
    paPlayer.destroyers +
    paPlayer.scorpions;

  const columns = [
    { label: "Astropods", accessor: "astropods" },
    { label: "Infinitys", accessor: "infinitys" },
    { label: "Wraiths", accessor: "wraiths" },
    { label: "Warfrigs", accessor: "warfrigs" },
    { label: "Destroyers", accessor: "destroyers" },
    { label: "Scorpions", accessor: "scorpions" },
  ];

  const caption = `Units (${shipCount} total)`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default UnitsTable;
