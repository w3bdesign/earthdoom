import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import EnergyTable from "@/components/Energy/EnergyTable";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

import { api } from "@/utils/api";

const Energy: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            {!isLoaded && <LoadingSpinner />}
            {paPlayer && <EnergyTable paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Energy;
