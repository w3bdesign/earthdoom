import { type FC } from "react";

import { DataTable } from "@/components/ui/common";

interface PaPlayer {
  id: number;
  metal: number;
  crystal: number;
  energy: number;
  civilians: number;
  asteroid_crystal: number;
  asteroid_metal: number;
  score: number;
  rank: number;
  nick: string;
  [key: string]: string | number;
}

interface OverviewTableProps {
  paPlayer: PaPlayer;
}

const OverviewTable: FC<OverviewTableProps> = ({ paPlayer }) => {
  const columns = [
    { label: "Crystal", accessor: "crystal" },
    { label: "Titanium", accessor: "metal" },
    { label: "Energy", accessor: "energy" },
    { label: "Houses", accessor: "asteroid_crystal" },
    { label: "Titanium Mine", accessor: "asteroid_metal" },
    { label: "Rank", accessor: "rank" },
  ];

  const caption = `Overview for ${paPlayer?.nick}`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default OverviewTable;
