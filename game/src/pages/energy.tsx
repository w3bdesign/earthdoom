import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import EnergyTable from "@/components/features/Energy/EnergyTable";

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
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded && <LoadingSpinner />}
            {paPlayer && <EnergyTable paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Energy;
