import { type FC } from "react";

import DataTable, { TableColumn } from "@/components/common/DataTable";

interface OverviewTableProps {
  paPlayer: {
    crystal: bigint | number;
    metal: bigint | number;
    energy: bigint | number;
    rank: number;
    nick: string;
  };
}

const OverviewTable: FC<OverviewTableProps> = ({ paPlayer }) => {
  const columns: TableColumn[] = [
    { label: "Crystal", accessor: "crystal" },
    { label: "Titanium", accessor: "metal" },
    { label: "Energy", accessor: "energy" },
    { label: "Rank", accessor: "rank" },
  ];

  const caption = `Overview for ${paPlayer.nick}`;

  return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
};

export default OverviewTable;
