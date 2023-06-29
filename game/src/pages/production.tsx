import { useUser } from "@clerk/nextjs";
import Script from "next/script";

import type { NextPage } from "next";
import type { PaPlayer } from "@/components/features/Military/Military";

import { Layout } from "@/components/common/Layout";
import Production from "@/components/features/Production/Production";

import { api } from "@/utils/api";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

/**
 * Renders the production page if the user is signed in and has a username.
 * If the user does not have a username, it returns null.
 * If the user's query for their player data has not returned, it also returns null.
 * If the user has not constructed barracks, a message is displayed indicating that
 * they need to construct barracks before they can produce units.
 *
 * @param {PaPlayer} paPlayer - The player data for the user
 * @return {JSX.Element} - The production page JSX if the user has constructed an airport
 * and is signed in with a username, otherwise null
 */
const ProductionPage: NextPage = () => {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const renderBarracksMessage = (paPlayer: PaPlayer) => {
    if (
      paPlayer &&
      (Number(paPlayer.c_airport) === 0 || Number(paPlayer.c_airport) > 1)
    ) {
      return (
        <>
          <h1 className="text-center text-2xl font-bold text-white mt-6 ">
            Production
          </h1>
          <div className="mb-4 mt-6 rounded bg-white px-8 py-5 shadow-md md:w-[44.563rem]">
            <h2 className="text-md p-2 text-center text-black  md:text-lg">
              You need to construct barracks before you can produce units
            </h2>
          </div>
        </>
      );
    }
    return null;
  };

  if (!paPlayer) {
    return (
      <Layout>
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout paPlayer={paPlayer}>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 md:w-[63rem]">
            <div className="relative sm:mx-auto">
              {renderBarracksMessage(paPlayer)}
              {paPlayer && paPlayer.c_airport === 1 && (
                <>
                  <h1 className="py-6 text-center text-2xl font-bold text-white">
                    Production
                  </h1>
                  <Production paPlayer={paPlayer} />
                </>
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
