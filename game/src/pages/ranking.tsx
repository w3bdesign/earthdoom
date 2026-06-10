import type { NextPage } from "next";
import type { PaPlayerBase } from "@/types/player";
import type { AdvancedTableColumn } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";
import type { Building } from "@/components/features/Construct/types/types";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { AdvancedDataTable } from "@/components/ui";
import RankingActions from "@/components/ui/tables/RankingActions";
import PageShell from "@/components/common/PageShell";

/**
 * Renders the Ranking page component, which displays the player ranking table.
 *
 * @return {JSX.Element} The RankingPage component to be rendered.
 */
const RankingPage: NextPage = () => {
  const { paPlayer, isAuthenticated, isSignedIn, user } = usePlayerData();

  const { data: paRanking } = api.paUsers.getAll.useQuery(undefined, {
    enabled: !!isSignedIn && !!user?.username,
  });

  const columns: AdvancedTableColumn[] = [
    { label: "Nick", accessor: "nick" },
    { label: "Score", accessor: "score" },
    { label: "Size", accessor: "size" },
    { label: "Rank", accessor: "rank" },
    {
      label: "Actions",
      accessor: (row: PaPlayerBase | Building) => {
        if (!paPlayer) return <></>;
        if ("nick" in row && typeof row.nick === "string") {
          const playerRow = row as PaPlayerBase;
          return (
            <RankingActions
              playerNick={playerRow.nick}
              newbie={
                typeof playerRow.newbie === "number" ? playerRow.newbie : 0
              }
              currentPlayer={paPlayer}
            />
          );
        }
        return <></>;
      },
    },
  ];

  return (
    <PageShell isAuthenticated={isAuthenticated} paPlayer={paPlayer}>
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
          {paPlayer && paRanking && (
            <AdvancedDataTable
              columns={columns}
              data={paRanking as PaPlayerBase[]}
              caption="Player ranking"
            />
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default RankingPage;
