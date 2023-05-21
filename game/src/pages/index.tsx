import { Layout } from "@/components/common/Layout";
import LandTable from "@/components/ui/tables/LandTable";
import BDUTable from "@/components/ui/tables/BDUTable";
import UnitsTable from "@/components/ui/tables/UnitsTable";
import FleetStatus from "@/components/ui/tables/FleetStatus";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

const Home = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  if (!paPlayer) return null;

  return (
    <Layout paPlayer={paPlayer}>
      <div className="container mb-6 flex flex-col items-center justify-center">
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
