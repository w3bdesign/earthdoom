import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import SpyingTable from "@/components/features/Spying/SpyingTable";

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
        <div className="container flex flex-col items-center justify-center mb-6">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded && <LoadingSpinner />}
            {paPlayer && <SpyingTable paPlayer={paPlayer} />}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Energy;
