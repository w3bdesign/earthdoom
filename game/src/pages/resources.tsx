import type { NextPage } from "next";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { renderIncomeData } from "@/utils/functions";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { RESOURCE } from "@/components/features/Resources/constants/RESOURCE";
import BarGraph from "@/components/features/Resources/BarGraph";
import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";
import PageShell from "@/components/common/PageShell";

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

  const { mutate, isLoading } = api.paConstruct.developLand.useMutation({
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
    <PageShell isAuthenticated={isAuthenticated} paPlayer={paPlayer} showSpinnerOnUnauthenticated>
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 md:w-[63rem]">
          {!isLoaded && <LoadingSpinner />}
          {paPlayer && (
            <IncomeSection paPlayer={paPlayer} />
          )}
          {paPlayer && paPlayer.ui_roids === 0 && (
            <UndevelopedLandMessage message="You have no land to develop" />
          )}
          {paPlayer && paPlayer.ui_roids > 0 && (
            <>
              <UndevelopedLandMessage message={`Undeveloped land: ${paPlayer.ui_roids}`} />
              <AdvancedDataTable
                isLoading={isLoading}
                columns={columns}
                data={[paPlayer]}
                caption="Resources"
                renderData={RESOURCE}
                action={mutate}
                actionText="Construct"
                actionInProgress="Constructing ..."
                considerLand={true}
              />
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
};

/** Displays income bar graph or "no land" message */
const IncomeSection = ({ paPlayer }: { paPlayer: Parameters<typeof renderIncomeData>[0] }) => {
  const hasNoLand =
    paPlayer.ui_roids === 0 &&
    paPlayer.asteroid_crystal === 0 &&
    paPlayer.asteroid_metal === 0;

  return (
    <div className="mx-auto mb-4 mt-6 rounded bg-white py-4 shadow md:w-[47.125rem]">
      {hasNoLand ? (
        <h2 className="p-4 text-center text-2xl font-bold">No land, no income.</h2>
      ) : (
        <BarGraph chartData={renderIncomeData(paPlayer)} />
      )}
    </div>
  );
};

/** Displays undeveloped land info message */
const UndevelopedLandMessage = ({ message }: { message: string }) => (
  <div className="mx-auto mt-4 w-[20.625rem] rounded bg-white py-4 shadow md:w-[47.125rem]">
    <h1 className="py-4 text-center text-2xl">{message}</h1>
  </div>
);

export default Resources;
