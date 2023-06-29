import type { NextPage } from "next";

import { Layout } from "@/components/common/Layout";

/**
 * Renders the error page with a heading.
 *
 * @return {NextPage} The Next.js page component.
 */
const Error: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">Error page</p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Error;
