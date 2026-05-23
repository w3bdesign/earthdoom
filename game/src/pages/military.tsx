import type { NextPage } from "next";

import { usePlayerData } from "@/utils/usePlayerData";
import Military from "@/components/features/Military/Military";
import UnitsTable from "@/components/ui/tables/UnitsTable";
import FleetTable from "@/components/ui/tables/FleetTable";
import PageShell from "@/components/common/PageShell";

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
      <div className="container mb-6 flex flex-col items-center justify-center">
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
          {paPlayer && (
            <>
              <UnitsTable paPlayer={paPlayer} />
              <FleetTable paPlayer={paPlayer} />
              <Military paPlayer={paPlayer} />
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default MilitaryPage;
