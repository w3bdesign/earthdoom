import { useUser } from "@clerk/nextjs";
import Script from "next/script";

import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import Production from "@/components/Production/Production";

import { api } from "@/utils/api";


const ProductionPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Production
          </h1>
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative sm:mx-auto">
              {paPlayer && <Production paPlayer={paPlayer} />}
            </div>
          </div>
        </div>
        <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js"></Script>
      </Layout>
    </>
  );
};

export default ProductionPage;
