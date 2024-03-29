import { useUser } from "@clerk/nextjs";

import type { NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import { ToastComponent, Button, AdvancedDataTable } from "@/components/ui";
import { SPYING } from "@/components/features/Spying/constants/SPYING";

/**
 * Renders the spying page
 * Required for getting more land early in the game
 *
 * @returns {JSX.Element} The spying page component.
 */
const Spying: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn, isLoaded } = useUser();

  let uiRoids = 0;

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  uiRoids = paPlayer?.ui_roids || 0;

  const { mutate, isLoading } = api.paSpying.spyingInitiate.useMutation({
    onSuccess: async (data) => {
      const newAmountOfRoids = data.ui_roids - uiRoids;

      ToastComponent({
        message: `Spying complete - found ${newAmountOfRoids} land`,
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
    { label: "Cost", accessor: "buildingCost" },
    { label: "Amount", accessor: "amount", type: "inputNumber" },
    { label: "Action", accessor: <Button />, type: "button" },
  ];

  const caption = "Spying";

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
            {!isLoaded && <LoadingSpinner />}
            {paPlayer && (
              <AdvancedDataTable
                isLoading={isLoading}
                columns={columns}
                data={[paPlayer]}
                caption={caption}
                renderData={SPYING}
                action={mutate}
                actionText="Spy"
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Spying;
