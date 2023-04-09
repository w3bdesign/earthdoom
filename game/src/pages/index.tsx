import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

import LandTable from "@/components/Index/LandTable";
import BDUTable from "@/components/Index/BDUTable";
import UnitsTable from "@/components/Index/UnitsTable";
import FleetStatus from "@/components/Index/FleetStatus";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasRendered(true);
    }, 5000);
  }, []);
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
              Has rendered: {hasRendered ? "true" : "false"}
              {hasRendered && (
                <>
                  {/*<UnitsTable Userid={1} />
                  <BDUTable Userid={1} />
              <LandTable Userid={1} />*/}
                  <FleetStatus Userid={1} />
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
