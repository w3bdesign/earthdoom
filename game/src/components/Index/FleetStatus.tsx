import { api } from "@/utils/api";

import { type FC } from "react";

interface FleetStatusProps {
  paPlayer: {
    war: number;
    def: number;
    wareta: number;
    defeta: number;
  };
}

const FleetStatus: FC<FleetStatusProps> = ({ paPlayer }) => {
  const { data: paAttackedName } = api.paUsers.getAttackedPlayer.useQuery({
    Warid: paPlayer.war,
  });

  const { data: paDefendedName } = api.paUsers.getDefendedPlayer.useQuery({
    Defid: paPlayer.def,
  });

  return (
    <>
      <div className="mt-6 flex h-full w-full flex-col items-center justify-center">
        <h2 className="py-6 text-center text-2xl font-bold text-white">Fleet status</h2>
        <span className="mx-auto mb-10 min-h-[100px] text-lg bg-white w-full text-center rounded py-2 shadow flex flex-col items-center justify-center">
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
