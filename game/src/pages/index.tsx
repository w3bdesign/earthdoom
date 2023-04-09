import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

import LandTable from "@/components/Index/LandTable";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";
import FleetStatus from "@/components/Index/FleetStatus";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <h1 className="text-2xl ">Main</h1>
            <p className="text-base">
              This page is a work in progress. It is not a finished product.
            </p>
            <div className="relative sm:mx-auto">
              {/*<UnitsTable Userid={1} />
              <BDUTable Userid={1} />*/}
              {/*<LandTable Userid={1} />*/}
              <FleetStatus Userid={1} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
