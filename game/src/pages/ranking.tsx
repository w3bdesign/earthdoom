import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import Ranking from "@/components/features/Ranking/Ranking";

import { api } from "@/utils/api";

const RankingPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getAll.useQuery();

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center mb-6">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {paPlayer && <Ranking paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RankingPage;
