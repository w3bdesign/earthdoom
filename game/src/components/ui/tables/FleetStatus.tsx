import { api } from "@/utils/api";

import LoadingSpinner from "@/components/common/Loader/LoadingSpinner";

interface FleetStatusProps {
  paPlayer: {
    war: number;
    def: number;
    wareta: number;
  } | null;
}

const FleetStatus: React.FC<FleetStatusProps> = ({ paPlayer }) => {
  if (!paPlayer) return <LoadingSpinner />;

  const { data: paAttackedName, isLoading: isLoadingAttacked } =
    api.paUsers.getAttackedPlayer.useQuery({
      Warid: paPlayer.war,
    });

  const { data: paDefendedName, isLoading: isLoadingDefended } =
    api.paUsers.getDefendedPlayer.useQuery({
      Defid: paPlayer.def,
    });

  const allFleetsAtHome =
    paPlayer &&
    paPlayer.war === 0 &&
    paPlayer.def === 0 &&
    "All fleets at home";

  const returning =
    paPlayer && (paPlayer.war < 0 || paPlayer.def < 0)
      ? `Returning ... ETA ${paPlayer.wareta}`
      : false;

  const attacking =
    paPlayer &&
    paAttackedName &&
    paPlayer.wareta >= 5 &&
    `Attacking ${paAttackedName.nick} #${paAttackedName.id}   (ETA: ${
      paPlayer.wareta - 5
    } ticks)`;

  const attackingWithZeroEta =
    paPlayer &&
    paAttackedName &&
    paPlayer.wareta < 5 &&
    `Attacking ${paAttackedName.nick} #${paAttackedName.id}   (ETA: 0 ticks)`;

  const defending =
    paPlayer &&
    paDefendedName &&
    paPlayer.wareta >= 5 &&
    `Defending ${paDefendedName.nick} #${paDefendedName.id}   (ETA: ${
      paPlayer.wareta - 5
    } ticks)`;

  const defendingWithZeroEta =
    paPlayer &&
    paDefendedName &&
    paPlayer.wareta < 5 &&
    `Defending ${paDefendedName.nick} #${paDefendedName.id}   (ETA: 0 ticks)`;

  return (
    <>
      <div className="mt-6 flex h-full w-full flex-col items-center justify-center">
        <h2 className="py-4 text-center text-2xl font-bold text-white">
          Fleet status
        </h2>
        <span className="text-md mx-auto mb-10 flex min-h-[6.25rem] w-full flex-col items-center justify-center rounded bg-white px-6 py-2 text-center shadow md:px-0 md:text-lg">
          {isLoadingAttacked || (isLoadingDefended && <LoadingSpinner />)}
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
