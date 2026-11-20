import type { NextPage } from "next";
import type { TMutateType } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { renderIncomeData } from "@/utils/functions";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { RESOURCE } from "@/components/features/Resources/constants/RESOURCE";
import BarGraph from "@/components/features/Resources/BarGraph";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";

const columns = [
  { label: "Name", accessor: "buildingName" },
  { label: "Description", accessor: "buildingDescription" },
  { label: "Cost", accessor: "buildingCost" },
  { label: "Amount", accessor: "amount", type: "inputNumber" },
  { label: "Action", accessor: <Button />, type: "button" },
];

/**
 * Renders a resource management page for a user, displaying their current income
 * and available resources.
 *
 * @return {JSX.Element} A React component representing the resources page
 */
const Resources: NextPage = () => {
  const ctx = api.useContext();
  const { paPlayer, isAuthenticated, isLoaded } = usePlayerData();

  const { mutate, isPending: isLoading } =
    api.paConstruct.developLand.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "Resource initiated", type: "success" });
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
        title="Resources"
        description="Develop land into houses, which raise credit income, or titanium mines."
      />
      {!isLoaded && <LoadingSpinner />}
      <div className="flex flex-col gap-4">
        {paPlayer && <IncomeSection paPlayer={paPlayer} />}
        {paPlayer && paPlayer.ui_roids === 0 && (
          <UndevelopedLandMessage message="You have no land to develop" />
        )}
        {paPlayer && paPlayer.ui_roids > 0 && (
          <>
            <UndevelopedLandMessage
              message={`Undeveloped land: ${paPlayer.ui_roids}`}
            />
            <AdvancedDataTable
              isLoading={isLoading}
              columns={columns}
              data={[paPlayer]}
              caption="Resources"
              renderData={RESOURCE}
              action={mutate as unknown as TMutateType}
              actionText="Construct"
              actionInProgress="Constructing ..."
              considerLand={true}
            />
          </>
        )}
      </div>
    </PageShell>
  );
};

/** Displays income bar graph or "no land" message */
const IncomeSection = ({
  paPlayer,
}: {
  paPlayer: Parameters<typeof renderIncomeData>[0];
}) => {
  const hasNoLand =
    paPlayer.ui_roids === 0 &&
    paPlayer.asteroid_crystal === 0 &&
    paPlayer.asteroid_metal === 0;

  return (
    <Panel title="Income per tick">
      {hasNoLand ? (
        <p className="text-sm text-muted">No land, no income.</p>
      ) : (
        <BarGraph chartData={renderIncomeData(paPlayer)} />
      )}
    </Panel>
  );
};

/** Heading for the land table, with the undeveloped land count */
const UndevelopedLandMessage = ({ message }: { message: string }) => (
  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
    <h2 className="text-base font-semibold text-ink">Develop land</h2>
    <p className="text-sm text-muted">{message}</p>
  </div>
);

export default Resources;
