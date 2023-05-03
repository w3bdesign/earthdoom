import { useUser } from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { Button, TestDataTable, ToastComponent } from "@/components/ui/common";
import { BUILDINGS } from "@/components/features/Construct/constants/BUILDINGS";

const Construction: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) return null;

  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    nick: user.username,
  });

  const { mutate } = api.paUsers.constructBuilding.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Building started", type: "success" });
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  if (!paPlayer) return null;

  const columns = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Action", accessor: <Button>Construct</Button> },
  ];

  const caption = "Construction";

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center px-2 py-2 ">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
            <div className="relative py-4 sm:mx-auto">
              {paPlayer && (
                <TestDataTable
                  columns={columns}
                  data={[paPlayer]}
                  caption={caption}
                  renderData={BUILDINGS}
                  action={mutate}
                  actionText="Construct"
                />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Construction;
