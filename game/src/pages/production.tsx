import { useUser } from "@clerk/nextjs";
import Script from "next/script";

import type { NextPage } from "next";
import type { PaPlayer } from "@/components/features/Military/Military";

import { Layout } from "@/components/common/Layout";
import Production from "@/components/features/Production/Production";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

import { api } from "@/utils/api";
import { renderMessage } from "@/utils/functions";
import { AdvancedDataTable, Button, ToastComponent } from "@/components/ui";
import { PRODUCTION } from "@/components/features/Production/constants/PRODUCTION";

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
  const ctx = api.useContext();
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
      return renderMessage({
        title: "Production",
        message: "You need to construct barracks before you can produce units",
      });
    }
    return null;
  };

  const { mutate, isLoading } = api.paUsers.produceUnit.useMutation({
    onSuccess: async () => {
      ToastComponent({
        message: "Training started",
        type: "success",
      });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({
        message: "Database error",
        type: "error",
      });
    },
  });

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Amount", accessor: "amount", type: "inputNumber" },
    { label: "Action", accessor: <Button />, type: "button" },
  ];

  const caption = "Production";

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


            <div className="relative sm:mx-auto">
              {paPlayer && (
                <AdvancedDataTable
                  isLoading={isLoading}
                  columns={columns}
                  data={[paPlayer]}
                  caption={caption}
                  renderData={PRODUCTION}
                  action={mutate}
                  actionText="Train"
                  actionInProgress="Training ..."
                />
              )}
            </div>
          </div>
        </div>
       
      </Layout>
    </>
  );
};

export default ProductionPage;
