import type { NextPage } from "next";
import type {
  AdvancedTableColumn,
  TMutateType,
} from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { BUILDINGS } from "@/components/features/Construct/constants/BUILDINGS";
import PageShell from "@/components/common/PageShell";

const columns: AdvancedTableColumn[] = [
  { label: "Name", accessor: "buildingName" },
  { label: "Description", accessor: "buildingDescription" },
  { label: "ETA", accessor: "buildingETA" },
  { label: "Cost", accessor: "buildingCost" },
  { label: "Action", accessor: <Button />, type: "button" },
];

/**
 * A page component that displays a table of buildings a user can construct.
 *
 * @return {JSX.Element} The constructed page component.
 */
const Construction: NextPage = () => {
  const ctx = api.useContext();
  const { paPlayer, isAuthenticated } = usePlayerData();

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

  return (
    <PageShell isAuthenticated={isAuthenticated} paPlayer={paPlayer}>
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 md:w-[63rem]">
          <div className="relative sm:mx-auto">
            {paPlayer && (
              <AdvancedDataTable
                isLoading={isLoading}
                columns={columns}
                data={[paPlayer]}
                caption="Construction"
                renderData={BUILDINGS}
                action={mutate as unknown as TMutateType}
                actionText="Construct"
                actionInProgress="Constructing ..."
              />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Construction;
