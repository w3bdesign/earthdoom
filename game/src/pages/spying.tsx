import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

import { api } from "@/utils/api";

import {
  ToastComponent,
  Button,
  AdvancedDataTable,
} from "@/components/ui/common";
import { SPYING } from "@/components/features/Spying/constants/SPYING";

const Energy: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  const { mutate, isLoading } = api.paUsers.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({
        message: "Spying complete",
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

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Amount", accessor: "amount", type: "inputNumber" },
    { label: "Action", accessor: <Button />, type: "button" },
  ];

  const caption = "Spying";

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
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

export default Energy;
