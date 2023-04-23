import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const Game: NextPage = () => {
  return (
    <>
      <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <p className="text-2xl text-white"></p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Game;
