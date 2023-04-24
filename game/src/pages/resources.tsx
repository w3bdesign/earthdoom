import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import ResourceTable from "@/components/Resources/ResourceTable";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";
import BarGraph from "@/components/Resources/BarGraph";

import { api } from "@/utils/api";
import { renderIncomeData } from "@/utils/functions";

const Resources: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  if (!paPlayer) return null;

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded && <LoadingSpinner />}
            <div className=" border-1 border-indigo-900 bg-white py-4 ">
              <BarGraph chartData={renderIncomeData(paPlayer)} />
            </div>
            {paPlayer && paPlayer?.ui_roids > 0 && (
              <h1 className="mt-6 py-4 text-center text-2xl text-white">
                Undeveloped land: {paPlayer?.ui_roids}
              </h1>
            )}
            {paPlayer && paPlayer?.ui_roids > 0 && (
              <div className="py-4">
                <ResourceTable paPlayer={paPlayer} />
              </div>
            )}
            {paPlayer?.ui_roids === 0 && (
              <h1 className="mt-6 py-4 text-center text-2xl text-white">
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
