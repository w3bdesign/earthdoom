import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import { ENERGY } from "@/components/features/Energy/constants/ENERGY";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";

/**
 * A page component that renders the Energy page.
 *
 * @return {JSX.Element} The Energy page.
 */
const Energy: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { mutate, isLoading } = api.paSpying.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Construction started", type: "success" });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Amount", accessor: "ui_roids", type: "inputNumber" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Action", accessor: <Button />, type: "button" },
  ];

  const caption = "Energy";

  if (!paPlayer || !isSignedIn || !user.username) {
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
          <div
            className={`relative flex flex-col justify-center overflow-hidden bg-neutral-900 ${
              paPlayer.r_energy === 1 ? "md:w-[63rem]" : ""
            }`}
          >
            {!isLoaded && <LoadingSpinner />}
            {(paPlayer.r_energy === 0 || paPlayer.r_energy > 1) && (
              <div className="mb-4 mt-8 rounded bg-white px-8 py-5 shadow-md md:w-[713px]">
                <h2 className="p-2 text-center text-xl font-bold text-black">
                  You need to research power plants before you can build them
                </h2>
              </div>
            )}
            {paPlayer && paPlayer.r_energy === 1 && (
              <AdvancedDataTable
                isLoading={isLoading}
                columns={columns}
                data={[paPlayer]}
                caption={caption}
                renderData={ENERGY}
                action={mutate}
                actionText="Construct"
                actionInProgress="Constructing ..."
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Energy;
