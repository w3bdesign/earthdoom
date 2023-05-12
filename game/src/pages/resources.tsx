import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import BarGraph from "@/components/features/Resources/BarGraph";

import { api } from "@/utils/api";
import { renderIncomeData } from "@/utils/functions";

import {
  Button,
  AdvancedDataTable,
  ToastComponent,
} from "@/components/ui/common";

import { RESOURCE } from "@/components/features/Resources/constants/RESOURCE";

const Resources: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { mutate, isLoading } = api.paUsers.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({
        message: "Production started",
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

  if (!paPlayer) return null;

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Amount", accessor: "amount", type: "inputNumber" },
    { label: "Action", accessor: <Button />, type: "button" },
  ];

  const caption = "Resources";

  const hasNoLand =
    paPlayer?.ui_roids === 0 &&
    paPlayer?.asteroid_crystal === 0 &&
    paPlayer?.asteroid_metal === 0;

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded && <LoadingSpinner />}
            <div className="mb-4 mt-6 md:w-[44.563rem] rounded bg-white py-4 shadow">
              {hasNoLand ? (
                <h2 className="p-4 text-center text-2xl font-bold">
                  No land, no income.
                </h2>
              ) : (
                <BarGraph chartData={renderIncomeData(paPlayer)} />
              )}
            </div>
            {paPlayer && paPlayer?.ui_roids > 0 && (
              <h1 className="mt-8 text-center text-2xl text-white">
                Undeveloped land: {paPlayer?.ui_roids}
              </h1>
            )}
            {paPlayer && paPlayer?.ui_roids > 0 && (
              <AdvancedDataTable
                isLoading={isLoading}
                columns={columns}
                data={[paPlayer]}
                caption={caption}
                renderData={RESOURCE}
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

export default Resources;
