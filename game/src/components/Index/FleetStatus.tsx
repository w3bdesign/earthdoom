import { api } from "@/utils/api";

interface FleetStatusProps {
  paPlayer: {
    war: number;
    def: number;
    wareta: number;
    defeta: number;
  } | null;
}

const FleetStatus: React.FC<FleetStatusProps> = ({ paPlayer }) => {
  const { data: paAttackedName } = api.paUsers.getAttackedPlayer.useQuery({
    Warid: paPlayer?.war,
  });

  const { data: paDefendedName } = api.paUsers.getDefendedPlayer.useQuery({
    Defid: paPlayer?.def,
  });

  const allFleetsAtHome =
    paPlayer &&
    paPlayer.war === 0 &&
    paPlayer.def === 0 &&
    "All fleets at home";

  const returning =
    (paPlayer && paPlayer.war < 0) ||
    (paPlayer && paPlayer.def < 0 && `Returning ... ETA ${paPlayer?.wareta}`);

  const attacking =
    paPlayer &&
    paAttackedName &&
    paPlayer.wareta >= 5 &&
    `Attacking ${paAttackedName?.nick} #${paAttackedName?.id}   (ETA: ${
      paPlayer?.wareta - 5
    } ticks)`;

  const attackingWithZeroEta =
    paPlayer &&
    paAttackedName &&
    paPlayer?.wareta < 5 &&
    `Attacking ${paAttackedName?.nick} #${paAttackedName?.id}   (ETA: 0 ticks)`;

  const defending =
    paPlayer &&
    paDefendedName &&
    paPlayer.defeta >= 5 &&
    `Defending ${paDefendedName?.nick} #${paDefendedName?.id}   (ETA: ${
      paPlayer.defeta - 5
    } ticks)`;

  const defendingWithZeroEta =
    paPlayer &&
    paDefendedName &&
    paPlayer.defeta < 5 &&
    `Defending ${paDefendedName?.nick} #${paDefendedName?.id}   (ETA: 0 ticks)`;

  return (
    <>
      <div className="mt-6 flex h-full w-full flex-col items-center justify-center">
        <h2 className="py-6 text-center text-2xl font-bold text-white">
          Fleet status
        </h2>
        <span className="mx-auto mb-10 flex min-h-[100px] w-full flex-col items-center justify-center rounded bg-white py-2 text-center text-lg shadow">
          {allFleetsAtHome}
          {returning}
          {attacking}
          {attackingWithZeroEta}
          {defending}
          {defendingWithZeroEta}
        </span>
      </div>
    </>
  );
};

export default FleetStatus;
