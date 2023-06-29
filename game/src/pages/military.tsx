import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Military from "@/components/features/Military/Military";
import UnitsTable from "@/components/ui/tables/UnitsTable";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import FleetTable from "@/components/ui/tables/FleetTable";

/**
 * Renders the Military page component which displays the military information of a user's PA account.
 * Also allows the player to send troops to attack or defend
 *
 * @return {JSX.Element} The MilitaryPage component.
 */
const MilitaryPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  if (!paPlayer) {
    return null;
  }

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {paPlayer ? (
              <UnitsTable paPlayer={paPlayer} />
            ) : (
              <div className="py-6">
                <LoadingSpinner />
              </div>
            )}
            {paPlayer && (
              <>
                <FleetTable paPlayer={paPlayer} />
                <Military paPlayer={paPlayer} />
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MilitaryPage;
