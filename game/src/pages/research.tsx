import type { NextPage } from "next";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { BUILDINGS } from "@/components/features/Research/constants/RESEARCH";
import PageShell from "@/components/common/PageShell";

const columns = [
  { label: "Name", accessor: "buildingName" },
  { label: "Description", accessor: "buildingDescription" },
  { label: "ETA", accessor: "buildingETA" },
  { label: "Cost", accessor: "buildingCost" },
  { label: "Action", accessor: <Button />, type: "button" },
];

/**
 * Renders the research page. Displays a table of buildings with their descriptions,
 * ETAs, and costs, and allows the user to research a building by clicking a button.
 *
 * @return {JSX.Element} The research page component
 */
const ResearchPage: NextPage = () => {
  const ctx = api.useContext();
  const { paPlayer, isAuthenticated } = usePlayerData();

  const { mutate, isLoading } = api.paUsers.researchBuilding.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Research started", type: "success" });
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
                caption="Research"
                renderData={BUILDINGS}
                action={mutate}
                actionText="Research"
                actionInProgress="Researching ..."
              />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ResearchPage;
