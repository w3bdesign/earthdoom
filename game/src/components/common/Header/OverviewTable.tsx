import type { FC } from "react";
import type { PaPlayer } from "@/components/features/Military/Military";

import { DataTable } from "@/components/ui";

interface OverviewTableProps {
  paPlayer: PaPlayer;
}

/**
 * Renders an overview table for a given player.
 *
 * @param {OverviewTableProps} paPlayer - The player to render the table for.
 * @return {JSX.Element} The rendered overview table.
 */
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
