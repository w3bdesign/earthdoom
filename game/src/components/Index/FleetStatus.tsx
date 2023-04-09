import { type FC } from "react";

import { api } from "@/utils/api";

interface FleetStatusProps {
  Userid: number;
}

const FleetStatus: FC<FleetStatusProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  const warid = paPlayer?.war;
  const defid = paPlayer?.def;
  
  if (warid === undefined || defid === undefined) {
    return <h1>No player</h1>;
  }

  const { data: paAttackedName } = api.paUsers.getAttackedPlayer.useQuery({
    Warid: warid,
  });

  const { data: paDefendedName } = api.paUsers.getDefendedPlayer.useQuery({
    Defid: defid,
  });

  return (
    <>
      <div className="mt-4 flex h-full w-full flex-col items-center justify-center">
        <h2 className="py-6 text-center text-2xl font-bold text-white">
          Fleet status
        </h2>
        <span className="mx-auto mb-10 text-lg text-white">
          {paPlayer &&
            paPlayer.war === 0 &&
            paPlayer.def === 0 &&
            "All fleets at home"}
          {(paPlayer && paPlayer.war < 0) ||
            (paPlayer &&
              paPlayer.def < 0 &&
              `Returning ... ETA ${paPlayer?.wareta}`)}

          {paPlayer &&
            paAttackedName &&
            paPlayer.wareta >= 5 &&
            `Attacking ${paAttackedName?.nick} #${
              paAttackedName?.id
            } ${"  "}  (ETA:  ${paPlayer?.wareta - 5} ticks)`}

          {paPlayer &&
            paAttackedName &&
            paPlayer?.wareta < 5 &&
            `Attacking ${paAttackedName?.nick} #${
              paAttackedName?.id
            } ${"  "}  (ETA: 0 ticks)`}

          {paPlayer &&
            paDefendedName &&
            paPlayer.defeta >= 5 &&
            `Defending ${paDefendedName?.nick} #${
              paDefendedName?.id
            } ${"  "}  (ETA:  ${paPlayer.defeta - 5} ticks)`}

          {paPlayer &&
            paDefendedName &&
            paPlayer.defeta < 5 &&
            `Defending ${paDefendedName?.nick} #${
              paDefendedName?.id
            } ${"  "}  (ETA: 0 ticks)`}
        </span>
      </div>
    </>
  );
};

export default FleetStatus;
