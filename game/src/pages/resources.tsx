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

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  const { mutate, isLoading } = api.paUsers.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({
        message: "Production started",
        type: "success",
      });
      await ctx.paUsers.getPlayerById.invalidate();
      await ctx.paUsers.getPlayerById.refetch();
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

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded && <LoadingSpinner />}
            <div className="mb-4 mt-6 bg-white py-4">
              <BarGraph chartData={renderIncomeData(paPlayer)} />
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
            {paPlayer?.ui_roids === 0 && (
              <h1 className="mt-6 py-4 text-center text-2xl text-white">
                You have no land
              </h1>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Resources;
