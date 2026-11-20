import type { NextPage } from "next";
import type { PaPlayer } from "@/types/player";
import type { TMutateType } from "@/components/ui/tables/AdvancedDataTable/AdvancedDataTable";

import { api } from "@/utils/api";
import { usePlayerData } from "@/utils/usePlayerData";
import Link from "next/link";
import { Button, AdvancedDataTable, ToastComponent } from "@/components/ui";
import { ENERGY } from "@/components/features/Energy/constants/ENERGY";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";

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
    return (
      <p className="rounded-lg border border-line bg-panel px-5 py-4 text-sm text-muted">
        You need to research power plants before you can build them.{" "}
        <Link
          href="/research"
          className="font-semibold text-accent hover:underline"
        >
          Go to Research
        </Link>
      </p>
    );
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

  const { mutate, isPending: isLoading } =
    api.paSpying.spyingInitiate.useMutation({
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
      <PageHeader
        title="Energy"
        description="Each power plant produces 45 energy per tick. Attacks cost energy."
      />
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
    </PageShell>
  );
};

export default Energy;
