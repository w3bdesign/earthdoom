import type { PaPlayer } from "@/components/features/Production/Production";

import { DataTable } from "@/components/ui";

import { type FC } from "react";

interface BDUTableProps {
  paPlayer: PaPlayer;
}

const BDUTable: FC<BDUTableProps> = ({ paPlayer }) => {
  const bduCount = paPlayer.rcannons + paPlayer.avengers + paPlayer.lstalkers;

  const columns = [
    { label: "Reaper cannons", accessor: "rcannons" },
    { label: "Avengers", accessor: "avengers" },
    { label: "Lucius stalkers", accessor: "lstalkers" },
  ];

  const caption = `BDU (${bduCount} total)`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default BDUTable;
