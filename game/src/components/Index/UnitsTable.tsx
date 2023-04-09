import { type FC } from "react";

import DataTable from "@/components/common/DataTable";

interface LandTableProps {
  paPlayer: {
    astropods: number;
    infinitys: number;
    warfrigs: number;
    destroyers: number;
    scorpions: number;
  };
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
