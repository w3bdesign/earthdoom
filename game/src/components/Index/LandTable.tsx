import DataTable from "@/components/common/DataTable";
import { api } from "@/utils/api";

interface LandTableProps {
  Userid: number;
}

const LandTable: React.FC<LandTableProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  let roidCount = 0;

  if (!paPlayer) return null;

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
