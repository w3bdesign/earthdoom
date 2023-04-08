import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import LandTable from "@/components/Index/LandTable";

import { api } from "@/utils/api";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";

const Home: NextPage = () => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid: 1,
  });

  let shipCount = 0;

  if (paPlayer) {
    shipCount =
      paPlayer.astropods +
      paPlayer.infinitys +
      paPlayer.wraiths +
      paPlayer.warfrigs +
      paPlayer.destroyers +
      paPlayer.scorpions;
  }

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative sm:mx-auto">
              <UnitsTable Userid={1} />
              <BDUTable Userid={1} />
              <LandTable Userid={1} />
              <div className="mt-4 flex h-full w-full flex-col items-center justify-center">
                <h2 className="py-6 text-center text-2xl font-bold text-white">
                  Fleet status
                </h2>
                <span className="mx-auto mb-10 text-lg text-white">
                  {paPlayer && paPlayer.war === 0 && "All fleets at home"}
                  {paPlayer &&
                    paPlayer.war < 0 &&
                    `Returning ... ETA ${paPlayer?.wareta}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
