import DataTable from "@/components/common/DataTable";
import { api } from "@/utils/api";

interface LandTableProps {
  Userid: number;
}

const UnitsTable: React.FC<LandTableProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  let shipCount = 0;

  if (!paPlayer) return null;

  shipCount =
    paPlayer.astropods +
    paPlayer.infinitys +
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
