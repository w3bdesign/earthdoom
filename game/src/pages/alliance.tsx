import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import Alliance from "@/components/Alliance/Alliance";

const AlliancePage: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center text-white">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative py-4 sm:mx-auto"></div>
           <Alliance />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AlliancePage;
