import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import Construct from "@/components/Construct/Construct";

import { api } from "@/utils/api";

const Game: NextPage = () => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid: 1,
  });

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Construction
          </h1>
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative sm:mx-auto">
              {paPlayer && <Construct paPlayer={paPlayer} />}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Game;
