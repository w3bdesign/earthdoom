import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";

const Game: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="text-2xl text-white"></p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Game;
