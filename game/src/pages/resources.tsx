import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import ResourceTable from "@/components/Resources/ResourceTable";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

import { api } from "@/utils/api";

const Resources: NextPage = () => {
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
            {paPlayer && paPlayer?.ui_roids > 0 && (
              <h1 className="text-center text-2xl text-white py-4">
                Undeveloped land: {paPlayer?.ui_roids}
              </h1>
            )}
            {paPlayer && paPlayer?.ui_roids > 0 && (
              <ResourceTable paPlayer={paPlayer} />
            )}
            {paPlayer?.ui_roids === 0 && (
              <h1 className="text-center text-2xl text-white">
                You have no land
              </h1>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Resources;
