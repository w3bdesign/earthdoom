import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const MilitaryPage: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <Military />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MilitaryPage;
