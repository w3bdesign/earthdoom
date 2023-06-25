import type { FC } from "react";
import type { PaPlayer } from "../../features/Production/Production";

import { DataTable } from "@/components/ui";

import { getShipCount } from "@/utils/functions";

interface LandTableProps {
  paPlayer: PaPlayer;
}

const UnitsTable: FC<LandTableProps> = ({ paPlayer }) => {
  const columns = [
    { label: "Astropods", accessor: "astropods" },
    { label: "Infinitys", accessor: "infinitys" },
    { label: "Wraiths", accessor: "wraiths" },
    { label: "Warfrigs", accessor: "warfrigs" },
    { label: "Destroyers", accessor: "destroyers" },
    { label: "Scorpions", accessor: "scorpions" },
  ];

  const caption = `Units (${getShipCount(paPlayer)} total)`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default UnitsTable;
