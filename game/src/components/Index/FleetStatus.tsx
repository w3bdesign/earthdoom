import { api } from "@/utils/api";

interface FleetStatusProps {
  Userid: number;
}

const FleetStatus: React.FC<FleetStatusProps> = ({ Userid }) => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid,
  });

  if (!paPlayer) return null;

  return (
    <div className="mt-4 flex h-full w-full flex-col items-center justify-center">
      <h2 className="py-6 text-center text-2xl font-bold text-white">
        Fleet status
      </h2>
      <span className="mx-auto mb-10 text-lg text-white">
        {paPlayer && paPlayer.war === 0 && "All fleets at home"}
        {paPlayer &&
          paPlayer.war < 0 &&
          `Returning ... ETA ${paPlayer?.wareta}`}
      </span>
    </div>
  );
};

export default FleetStatus;
