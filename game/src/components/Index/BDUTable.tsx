import DataTable from "@/components/common/DataTable";
import { api } from "@/utils/api";

interface BDUTableProps {
  Userid: number;
}

const BDUTable: React.FC<BDUTableProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  if (!paPlayer) return null;

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
