import type { FC } from "react";
import type { PaPlayer } from "@/components/features/Military/Military";

import { DataTable } from "@/components/ui";

interface LandTableProps {
  paPlayer: PaPlayer;
}

const LandTable: FC<LandTableProps> = ({ paPlayer }) => {
  let roidCount = 0;

  roidCount =
    paPlayer.asteroid_metal + paPlayer.asteroid_crystal + paPlayer.ui_roids;

  const columns = [
    { label: "Mines", accessor: "asteroid_metal" },
    { label: "Houses", accessor: "asteroid_crystal" },
    { label: "Undeveloped", accessor: "ui_roids" },
  ];

  const caption = `Land (${roidCount} total)`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default LandTable;
