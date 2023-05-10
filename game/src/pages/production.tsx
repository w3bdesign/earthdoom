import { useUser } from "@clerk/nextjs";
import Script from "next/script";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import Production from "@/components/features/Production/Production";

import { api } from "@/utils/api";

const ProductionPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
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
