import { api } from "@/utils/api";

interface FleetStatusProps {
  Userid: number;
}

const FleetStatus: React.FC<FleetStatusProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  if (!paPlayer) return null;

  const { data: paAttackedName } = api.paUsers.getAttackedPlayer.useQuery({
    Warid: paPlayer.war,
  });

  const { data: paDefendedName } = api.paUsers.getDefendedPlayer.useQuery({
    Defid: paPlayer.def,
  });

  return (
    <div className="mt-4 flex h-full w-full flex-col items-center justify-center">
      <h2 className="py-6 text-center text-2xl font-bold text-white">
        Fleet status
      </h2>
      <span className="mx-auto mb-10 text-lg text-white">
        {paPlayer.war === 0 && paPlayer.def === 0 && "All fleets at home"}
        {paPlayer.war < 0 ||
          (paPlayer.def < 0 && `Returning ... ETA ${paPlayer?.wareta}`)}

        {paAttackedName &&
          paPlayer.wareta >= 5 &&
          `Attacking ${paAttackedName?.nick} #${
            paAttackedName?.id
          } ${"  "}  (ETA:  ${paPlayer.wareta - 5} ticks)`}

        {paAttackedName &&
          paPlayer.wareta < 5 &&
          `Attacking ${paAttackedName?.nick} #${
            paAttackedName?.id
          } ${"  "}  (ETA: 0 ticks)`}

        {paDefendedName &&
          paPlayer.defeta >= 5 &&
          `Defending ${paDefendedName?.nick} #${
            paDefendedName?.id
          } ${"  "}  (ETA:  ${paPlayer.defeta - 5} ticks)`}

        {paDefendedName &&
          paPlayer.defeta < 5 &&
          `Defending ${paDefendedName?.nick} #${
            paDefendedName?.id
          } ${"  "}  (ETA: 0 ticks)`}
      </span>
    </div>
  );
};

export default FleetStatus;
