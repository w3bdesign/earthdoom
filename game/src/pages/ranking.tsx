import type { NextPage } from "next";
import type { PaPlayerBase } from "@/types/player";
import type { AdvancedTableColumn } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";
import type { Building } from "@/components/features/Construct/types/types";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { AdvancedDataTable } from "@/components/ui";
import RankingActions from "@/components/ui/tables/RankingActions";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import { formatNumber } from "@/utils/functions";

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
    { label: "Rank", accessor: "rank", align: "right" },
    {
      label: "Player",
      primary: true,
      accessor: (row: PaPlayerBase | Building) => {
        const player = row as PaPlayerBase;
        return (
          <span className="inline-flex flex-wrap items-center gap-2">
            {player.tag && (
              <span className="text-sm font-normal text-muted">
                [{player.tag}]
              </span>
            )}
            <span>{player.nick}</span>
            <span className="block w-full text-xs font-normal text-muted md:hidden">
              <span className="whitespace-nowrap">
                {formatNumber(player.score)} score
              </span>{" "}
              ·{" "}
              <span className="whitespace-nowrap">
                size {formatNumber(player.size)}
              </span>
            </span>
          </span>
        );
      },
    },
    { label: "Score", accessor: "score", align: "right", hideOnMobile: true },
    { label: "Size", accessor: "size", align: "right", hideOnMobile: true },
    {
      label: "Actions",
      type: "button",
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
      <PageHeader
        title="Ranking"
        description={
          paRanking
            ? `${paRanking.length} players, ranked by score.`
            : undefined
        }
      />
      {paPlayer && paRanking && (
        <AdvancedDataTable
          columns={columns}
          data={paRanking as PaPlayerBase[]}
          caption="Player ranking"
          highlightRow={(row) => row.nick === paPlayer.nick}
        />
      )}
    </PageShell>
  );
};

export default RankingPage;
