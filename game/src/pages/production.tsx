import type { NextPage } from "next";
import type { PaPlayer } from "@/types/player";

import { usePlayerData } from "@/utils/usePlayerData";
import { renderMessage } from "@/utils/functions";
import Production from "@/components/features/Production/Production";
import PageShell from "@/components/common/PageShell";

const renderBarracksMessage = (paPlayer: PaPlayer) => {
  if (Number(paPlayer.c_airport) === 0 || Number(paPlayer.c_airport) > 1) {
    return renderMessage({
      title: "Production",
      message: "You need to construct barracks before you can produce units",
    });
  }
  return null;
};

/**
 * Renders the production page if the user is signed in and has constructed barracks.
 *
 * @return {JSX.Element} - The production page JSX
 */
const ProductionPage: NextPage = () => {
  const { paPlayer, isAuthenticated } = usePlayerData();

  return (
    <PageShell isAuthenticated={isAuthenticated} paPlayer={paPlayer}>
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 md:w-[63rem]">
          <div className="relative sm:mx-auto">
            {paPlayer && renderBarracksMessage(paPlayer)}
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
    </PageShell>
  );
};

export default ProductionPage;
