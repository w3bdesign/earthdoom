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

  if (!paPlayer) return null;

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative sm:mx-auto">
              {(paPlayer && paPlayer.c_airport === 0) ||
                (paPlayer && paPlayer.c_airport! > 1 && (
                  <div className="mb-4 mt-8 rounded bg-white px-8 py-5 shadow-md md:w-[44.563rem]">
                    <h2 className="p-2 text-center text-xl font-bold text-black">
                      You need to construct barracks before you can produce
                      units
                    </h2>
                  </div>
                ))}
              {paPlayer && paPlayer.c_airport === 1 && (
                <Production paPlayer={paPlayer} />
              )}
            </div>
          </div>
        </div>
        <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js"></Script>
      </Layout>
    </>
  );
};

export default ProductionPage;
