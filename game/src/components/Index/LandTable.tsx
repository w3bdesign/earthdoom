import { type FC } from "react";

import DataTable from "@/components/common/DataTable";

interface LandTableProps {
  paPlayer: any;
}

const LandTable: FC<LandTableProps> = ({ paPlayer }) => {
  let roidCount = 0;

  roidCount =
    paPlayer.asteroid_metal + paPlayer.asteroid_crystal + paPlayer.ui_roids;

  const columns = [
    { label: "Titanium mines", accessor: "asteroid_metal" },
    { label: "Houses", accessor: "asteroid_crystal" },
    { label: "Undeveloped", accessor: "ui_roids" },
  ];

  const caption = `Land (${roidCount} total)`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default LandTable;
