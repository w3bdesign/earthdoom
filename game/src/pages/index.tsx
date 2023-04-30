import { Layout } from "@/components/common/Layout";
import LandTable from "@/components/Index/LandTable";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";
import FleetStatus from "@/components/Index/FleetStatus";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center px-2 py-2 ">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
          <div className="relative sm:mx-auto">
            {paPlayer ? (
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
