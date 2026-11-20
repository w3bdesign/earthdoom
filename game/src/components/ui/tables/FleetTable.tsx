import { api } from "@/utils/api";

import type { PaUsers } from "@prisma/client";
import type { FC } from "react";
import type { Tone } from "@/components/ui/Badge";

import Badge from "@/components/ui/Badge";
import Panel from "@/components/ui/Panel";
import Skeleton from "@/components/ui/Skeleton";

interface FleetStatusProps {
  paPlayer: PaUsers;
}

interface TargetPlayer {
  nick: string;
  id: number;
}

interface FleetStatus {
  state: string;
  tone: Tone;
  message: string;
}

/**
 * Determines the fleet status based on player state and target data.
 */
export const getFleetStatus = (
  paPlayer: PaUsers,
  attackTarget: TargetPlayer | null | undefined,
  defendTarget: TargetPlayer | null | undefined,
): FleetStatus => {
  const eta = Math.max(paPlayer.wareta - 5, 0);

  if (paPlayer.war === 0 && paPlayer.def === 0) {
    return { state: "Home", tone: "neutral", message: "All fleets at home" };
  }

  if (paPlayer.war < 0 || paPlayer.def < 0) {
    return {
      state: "Returning",
      tone: "caution",
      message: `Returning ... ETA ${paPlayer.wareta}`,
    };
  }

  if (paPlayer.war > 0 && attackTarget) {
    return {
      state: "Attacking",
      tone: "hostile",
      message: `Attacking ${attackTarget.nick} #${attackTarget.id} (ETA: ${eta} ticks)`,
    };
  }

  if (paPlayer.def > 0 && defendTarget) {
    return {
      state: "Defending",
      tone: "friendly",
      message: `Defending ${defendTarget.nick} #${defendTarget.id} (ETA: ${eta} ticks)`,
    };
  }

  return { state: "Away", tone: "caution", message: "" };
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
  const status = getFleetStatus(paPlayer, paAttackedName, paDefendedName);

  return (
    <Panel
      className="h-full"
      title="Fleet status"
      actions={!isLoading && <Badge tone={status.tone}>{status.state}</Badge>}
    >
      {isLoading ? (
        <Skeleton className="h-5 w-48" />
      ) : (
        <p className="text-sm text-ink">{status.message}</p>
      )}
    </Panel>
  );
};

export default FleetTable;
