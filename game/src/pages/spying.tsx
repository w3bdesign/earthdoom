import type { NextPage } from "next";
import type { TMutateType } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { ToastComponent, Button, AdvancedDataTable } from "@/components/ui";
import { SPYING } from "@/components/features/Spying/constants/SPYING";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const columns = [
  { label: "Name", accessor: "buildingName" },
  { label: "Description", accessor: "buildingDescription" },
  { label: "Cost", accessor: "buildingCost" },
  { label: "Amount", accessor: "amount", type: "inputNumber" },
  { label: "Action", accessor: <Button />, type: "button" },
];

/**
 * Renders the spying page.
 * Required for getting more land early in the game.
 *
 * @returns {JSX.Element} The spying page component.
 */
const Spying: NextPage = () => {
  const ctx = api.useContext();
  const { paPlayer, isAuthenticated, isLoaded } = usePlayerData();

  const uiRoids = paPlayer?.ui_roids || 0;

  const { mutate, isPending: isLoading } =
    api.paSpying.spyingInitiate.useMutation({
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
        ToastComponent({ message: "Database error", type: "error" });
      },
    });

  return (
    <PageShell
      isAuthenticated={isAuthenticated}
      paPlayer={paPlayer}
      showSpinnerOnUnauthenticated
    >
      <PageHeader
        title="Spying"
        description="Send scouts to find undeveloped land. Develop it on the Resources page."
      />
      {!isLoaded && <div data-testid="loading-spinner" />}
      {paPlayer && (
        <AdvancedDataTable
          isLoading={isLoading}
          columns={columns}
          data={[paPlayer]}
          caption="Spying"
          renderData={SPYING}
          action={mutate as unknown as TMutateType}
          actionText="Spy"
        />
      )}
    </PageShell>
  );
};

export default Spying;
