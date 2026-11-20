import type { NextPage } from "next";
import type { TMutateType } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { BUILDINGS } from "@/components/features/Research/constants/RESEARCH";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";

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

  const { mutate, isPending: isLoading } =
    api.paUsers.researchBuilding.useMutation({
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
      <PageHeader
        title="Research"
        description="Research improves your income and unlocks new buildings and units."
      />
      {paPlayer && (
        <AdvancedDataTable
          isLoading={isLoading}
          columns={columns}
          data={[paPlayer]}
          caption="Research"
          renderData={BUILDINGS}
          action={mutate as unknown as TMutateType}
          actionText="Research"
          actionInProgress="Researching ..."
        />
      )}
    </PageShell>
  );
};

export default ResearchPage;
