import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import Military from "@/components/features/Military/Military";

import { api } from "@/utils/api";
import UnitsTable from "@/components/Index/UnitsTable";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

const MilitaryPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {paPlayer ? (
              <>
                <UnitsTable paPlayer={paPlayer} />
              </>
            ) : (
              <div className="py-6">
                <LoadingSpinner />
              </div>
            )}
            {paPlayer && <Military paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MilitaryPage;
