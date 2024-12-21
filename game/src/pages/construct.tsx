import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import type { Building } from "@/components/features/Construct/types/types";
import type { AdvancedTableColumn } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { Layout } from "@/components/common/Layout";
import { AdvancedDataTable, ToastComponent } from "@/components/ui";
import { BUILDINGS } from "@/components/features/Construct/constants/BUILDINGS";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

/**
 * A page component that displays a table of buildings a user can construct.
 *
 * @return {JSX.Element} The constructed page component.
 */
const Construction: NextPage = () => {
  const ctx = api.useContext();
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user.username) {
    return null;
  }

  const { data: paPlayer } = api.paUsers.getPlayerByNick.useQuery({
    nick: user.username,
  });

  const { mutate, isLoading } = api.paConstruct.constructBuilding.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Building started", type: "success" });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  const columns: AdvancedTableColumn[] = [
    { label: "Name", accessor: "buildingName" },
    { label: "Description", accessor: "buildingDescription" },
    { label: "ETA", accessor: "buildingETA" },
    { label: "Cost", accessor: "buildingCost" },
    { label: "Action", accessor: "", type: "button" },
  ];

  const caption = "Construction";

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
              {paPlayer && (
                <AdvancedDataTable
                  isLoading={isLoading}
                  columns={columns}
                  data={[]}
                  caption={caption}
                  renderData={BUILDINGS}
                  action={mutate}
                  actionText="Construct"
                  actionInProgress="Constructing ..."
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
