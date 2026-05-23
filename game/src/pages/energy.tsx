import type { NextPage } from "next";
import type { PaPlayer } from "@/types/player";
import type { TMutateType } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import { renderMessage } from "@/utils/functions";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { ENERGY } from "@/components/features/Energy/constants/ENERGY";
import PageShell from "@/components/common/PageShell";

const columns = [
  { label: "Name", accessor: "buildingName" },
  { label: "Description", accessor: "buildingDescription" },
  { label: "ETA", accessor: "buildingETA" },
  { label: "Amount", accessor: "ui_roids", type: "inputNumber" },
  { label: "Cost", accessor: "buildingCost" },
  { label: "Action", accessor: <Button />, type: "button" },
];

const renderEnergyMessage = (paPlayer: PaPlayer) => {
  if (paPlayer.r_energy === 0 || paPlayer.r_energy > 1) {
    return renderMessage({
      title: "Energy",
      message: "You need to research power plants before you can build them",
    });
  }
  return null;
};

/**
 * A page component that renders the Energy page.
 *
 * @return {JSX.Element} The Energy page.
 */
const Energy: NextPage = () => {
  const ctx = api.useContext();
  const { paPlayer, isAuthenticated } = usePlayerData();

  const { mutate, isLoading } = api.paSpying.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Construction started", type: "success" });
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
        <div
          className={`relative flex flex-col justify-center overflow-hidden bg-neutral-900 ${
            paPlayer?.r_energy === 1 ? "md:w-[63rem]" : ""
          }`}
        >
          {paPlayer && renderEnergyMessage(paPlayer)}
          {paPlayer && paPlayer.r_energy === 1 && (
            <AdvancedDataTable
              isLoading={isLoading}
              columns={columns}
              data={[paPlayer]}
              caption="Energy"
              renderData={ENERGY}
              action={mutate as unknown as TMutateType}
              actionText="Construct"
              actionInProgress="Constructing ..."
            />
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default Energy;
