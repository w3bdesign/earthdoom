import type { NextPage } from "next";

import { usePlayerData } from "@/utils/usePlayerData";
import Military from "@/components/features/Military/Military";
import UnitsTable from "@/components/ui/tables/UnitsTable";
import FleetTable from "@/components/ui/tables/FleetTable";
import BDUTable from "@/components/ui/tables/BDUTable";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";

/**
 * Renders the Military page component which displays the military information
 * of a user's PA account. Also allows the player to send troops to attack or defend.
 *
 * @return {JSX.Element} The MilitaryPage component.
 */
const MilitaryPage: NextPage = () => {
  const { paPlayer, isAuthenticated } = usePlayerData();

  return (
    <PageShell isAuthenticated={isAuthenticated} paPlayer={paPlayer}>
      <PageHeader
        title="Military"
        description="Attacking costs 9 energy per ship. Defending is free."
      />
      {paPlayer && (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div className="flex flex-col gap-4">
            <Military paPlayer={paPlayer} />
          </div>
          <div className="flex flex-col gap-4">
            <FleetTable paPlayer={paPlayer} />
            <UnitsTable paPlayer={paPlayer} />
            <BDUTable paPlayer={paPlayer} />
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default MilitaryPage;
