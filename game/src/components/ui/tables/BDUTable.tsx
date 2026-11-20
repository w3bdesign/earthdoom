import type { PaPlayer } from "@/components/features/Military/Military";
import type { FC } from "react";

import Panel from "@/components/ui/Panel";
import StatList from "@/components/ui/StatList";

import { formatNumber } from "@/utils/functions";

interface BDUTableProps {
  paPlayer: PaPlayer;
}

/** The player's base defence units (BDU), with the total in the title. */
const BDUTable: FC<BDUTableProps> = ({ paPlayer }) => {
  const bduCount = paPlayer.rcannons + paPlayer.avengers + paPlayer.lstalkers;

  return (
    <Panel title="Base defence" meta={`${formatNumber(bduCount)} total`}>
      <StatList
        label="Base defence units"
        stats={[
          { label: "Reaper cannons", value: paPlayer.rcannons },
          { label: "Avengers", value: paPlayer.avengers },
          { label: "Lucius stalkers", value: paPlayer.lstalkers },
        ]}
      />
    </Panel>
  );
};

export default BDUTable;
