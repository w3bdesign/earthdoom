import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";

import { api } from "@/utils/api";
import { AdvancedDataTable } from "@/components/ui/common";

const RankingPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getAll.useQuery();

  const columns = [
    { label: "Nick", accessor: "nick" },
    { label: "Score", accessor: "score" },
    { label: "Rank", accessor: "rank" },
  ];

  const caption = `Player ranking`;

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {paPlayer && (
              <AdvancedDataTable
                columns={columns}
                data={paPlayer}
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
