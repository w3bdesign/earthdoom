import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Military from "@/components/features/Military/Military";
import UnitsTable from "@/components/Index/UnitsTable";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import FleetStatus from "@/components/Index/FleetStatus";

const MilitaryPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {paPlayer ? (
              <UnitsTable paPlayer={paPlayer} />
            ) : (
              <div className="py-6">
                <LoadingSpinner />
              </div>
            )}
            {paPlayer && <FleetStatus paPlayer={paPlayer} />}
            {paPlayer && <Military paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MilitaryPage;
