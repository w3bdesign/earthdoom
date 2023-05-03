import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "@/components/common/Layout";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import EnergyTable from "@/components/features/Energy/EnergyTable";

import { api } from "@/utils/api";
import { ENERGY } from "@/components/features/Energy/constants/ENERGY";
import { Button, TestDataTable, ToastComponent } from "@/components/ui/common";

const Energy: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !user.username) return <LoadingSpinner />;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  const { mutate } = api.paUsers.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Construction started", type: "success" });
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Amount", accessor: "ui_roids", type: "input" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Action", accessor: <Button>Construct</Button>, type: "button" },
  ];

  const caption = "Energy";

  return (
    <>
      <Layout>
        <div className="container mb-6 flex flex-col items-center justify-center">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            {!isLoaded && <LoadingSpinner />}
            {paPlayer && <EnergyTable paPlayer={paPlayer} />}

            {paPlayer && (
              <TestDataTable
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
