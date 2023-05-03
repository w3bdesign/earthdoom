import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";

const Error: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center mb-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">Error page</p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Error;
