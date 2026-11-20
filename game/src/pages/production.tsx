import type { NextPage } from "next";
import type { PaPlayer } from "@/types/player";

import { usePlayerData } from "@/utils/usePlayerData";
import Link from "next/link";
import Production from "@/components/features/Production/Production";
import PageShell from "@/components/common/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const renderBarracksMessage = (paPlayer: PaPlayer) => {
  if (Number(paPlayer.c_airport) === 0 || Number(paPlayer.c_airport) > 1) {
    return (
      <p className="rounded-lg border border-line bg-panel px-5 py-4 text-sm text-muted">
        You need to construct barracks before you can produce units.{" "}
        <Link
          href="/construct"
          className="font-semibold text-accent hover:underline"
        >
          Go to Construction
        </Link>
      </p>
    );
  }
  return null;
};

/**
 * Renders the production page if the user is signed in and has constructed barracks.
 *
 * @return {JSX.Element} - The production page JSX
 */
const ProductionPage: NextPage = () => {
  const { paPlayer, isAuthenticated } = usePlayerData();

  return (
    <PageShell isAuthenticated={isAuthenticated} paPlayer={paPlayer}>
      <PageHeader
        title="Production"
        description="Train units for your fleet and base defence. New factories unlock more units."
      />
      {paPlayer && renderBarracksMessage(paPlayer)}
      {paPlayer && paPlayer.c_airport === 1 && (
        <Production paPlayer={paPlayer} />
      )}
    </PageShell>
  );
};

export default ProductionPage;
