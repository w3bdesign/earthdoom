import type { FC } from "react";
import type { PaUsers } from "@prisma/client";

import { DataTable } from "@/components/ui/common";

interface IRankingProps {
  paPlayer: PaUsers[];
}

const Ranking: FC<IRankingProps> = ({ paPlayer }) => {
  const columns = [
    { label: "Nick", accessor: "nick" },
    { label: "Score", accessor: "score" },
    { label: "Rank", accessor: "rank" },
  ];

  const caption = `Player ranking`;

  return <DataTable columns={columns} data={paPlayer} caption={caption} />;
};

export default Ranking;
