import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const Preferences: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold">Preferences</h1>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Preferences;
