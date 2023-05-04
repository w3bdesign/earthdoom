import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";

const Senate: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="text-2xl text-white"></p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Senate;
