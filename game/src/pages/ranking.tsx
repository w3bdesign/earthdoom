import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import type { PaPlayer } from "@/components/features/Military/Military";
import type { AdvancedTableColumn } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { Layout } from "@/components/common/Layout";
import { AdvancedDataTable } from "@/components/ui";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import RankingActions from "@/components/ui/tables/RankingActions";

/**
 * Renders the Ranking page component, which displays the player ranking table.
 *
 * @return {JSX.Element} The RankingPage component to be rendered.
 */
const RankingPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paRanking } = api.paUsers.getAll.useQuery();

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const columns: AdvancedTableColumn[] = [
    { label: "Nick", accessor: "nick" },
    { label: "Score", accessor: "score" },
    { label: "Size", accessor: "size" },
    { label: "Rank", accessor: "rank" },
    { 
      label: "Actions", 
      accessor: (row: PaPlayer) => {
        if (!paPlayer) return <></>;
        return (
          <RankingActions 
            playerNick={row.nick} 
            newbie={row.newbie} 
            currentPlayer={paPlayer}
          />
        );
      }
    },
  ];

  const caption = `Player ranking`;

  if (!paPlayer || !paRanking) {
    return (
      <Layout>
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {paPlayer && (
              <AdvancedDataTable
                columns={columns}
                data={paRanking}
                caption={caption}
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RankingPage;
