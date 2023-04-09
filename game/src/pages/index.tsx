import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

import LandTable from "@/components/Index/LandTable";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";
import FleetStatus from "@/components/Index/FleetStatus";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid: 1,
  });

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <h1 className="text-2xl ">Main</h1>
            <p className="text-base">
              This page is a work in progress. It is very soon a finished product.
            </p>
            <div className="relative sm:mx-auto">
              {paPlayer && (
                <>
                  <UnitsTable paPlayer={paPlayer} />
                  <BDUTable paPlayer={paPlayer} />
                  <LandTable paPlayer={paPlayer} />
                  <FleetStatus paPlayer={paPlayer} />
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
