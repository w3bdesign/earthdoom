import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

import LandTable from "@/components/Index/LandTable";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";
import FleetStatus from "@/components/Index/FleetStatus";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { user, isLoaded } = useUser();

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: isLoaded && user?.username ? user.username : "",
  });

  if (!user) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
          <h1 className="text-center text-2xl">Main</h1>
          <div className="relative sm:mx-auto">
            {isLoaded && paPlayer ? (
              <>
                <UnitsTable paPlayer={paPlayer} />
                <BDUTable paPlayer={paPlayer} />
                <LandTable paPlayer={paPlayer} />
                <FleetStatus paPlayer={paPlayer} />
              </>
            ) : (
              <div className="py-6">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
