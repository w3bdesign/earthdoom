import { api } from "@/utils/api";

import type { PaUsers } from "@prisma/client";
import type { FC } from "react";

import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

interface FleetStatusProps {
  paPlayer: PaUsers;
}

interface TargetPlayer {
  nick: string;
  id: number;
}

/**
 * Determines the fleet status message based on player state and target data.
 */
const getFleetStatusMessage = (
  paPlayer: PaUsers,
  attackTarget: TargetPlayer | null | undefined,
  defendTarget: TargetPlayer | null | undefined,
): string => {
  if (paPlayer.war === 0 && paPlayer.def === 0) {
    return "All fleets at home";
  }

  if (paPlayer.war < 0 || paPlayer.def < 0) {
    return `Returning ... ETA ${paPlayer.wareta}`;
  }

  if (paPlayer.war > 0 && attackTarget) {
    const eta = Math.max(paPlayer.wareta - 5, 0);
    return `Attacking ${attackTarget.nick} #${attackTarget.id}   (ETA: ${eta} ticks)`;
  }

  if (paPlayer.def > 0 && defendTarget) {
    const eta = Math.max(paPlayer.wareta - 5, 0);
    return `Defending ${defendTarget.nick} #${defendTarget.id}   (ETA: ${eta} ticks)`;
  }

  return "";
};

const FleetTable: FC<FleetStatusProps> = ({ paPlayer }) => {
  const { data: paAttackedName, isLoading: isLoadingAttacked } =
    api.paUsers.getAttackedPlayer.useQuery({
      Warid: paPlayer.war,
    });

  const { data: paDefendedName, isLoading: isLoadingDefended } =
    api.paUsers.getDefendedPlayer.useQuery({
      Defid: paPlayer.def,
    });

  const isLoading = isLoadingAttacked || isLoadingDefended;
  const statusMessage = getFleetStatusMessage(
    paPlayer,
    paAttackedName,
    paDefendedName,
  );

  return (
    <div className="mt-6 flex h-full w-full flex-col items-center justify-center">
      <h2 className="py-4 text-center text-2xl font-bold text-white">
        Fleet status
      </h2>
      <span className="text-md mx-auto mb-10 flex min-h-[6.25rem] w-full flex-col items-center justify-center rounded bg-white px-6 py-2 text-center shadow md:px-0 md:text-lg">
        {isLoading ? <LoadingSpinner /> : statusMessage}
      </span>
    </div>
  );
};

export default FleetTable;
