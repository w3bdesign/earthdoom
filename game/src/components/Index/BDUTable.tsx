import DataTable from "@/components/common/DataTable";
import { api } from "@/utils/api";
import { type FC } from "react";

interface BDUTableProps {
  Userid: number;
}

const BDUTable: FC<BDUTableProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  if (paPlayer) {
    const bduCount = paPlayer.rcannons + paPlayer.avengers + paPlayer.lstalkers;

    const columns = [
      { label: "Reaper cannons", accessor: "rcannons" },
      { label: "Avengers", accessor: "avengers" },
      { label: "Lucius stalkers", accessor: "lstalkers" },
    ];

    const caption = `BDU (${bduCount} total)`;

    return <DataTable columns={columns} data={[paPlayer]} caption={caption} />;
  } else {
    return <h1>No player found</h1>;
  }
};

export default BDUTable;
