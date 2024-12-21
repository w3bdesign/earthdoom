import type { FC } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

interface RankingActionsProps {
  playerNick: string;
}

const RankingActions: FC<RankingActionsProps> = ({ playerNick }) => {
  const router = useRouter();
  const { user } = useUser();

  // Don't show actions for the current user
  if (user?.username === playerNick) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => router.push(`/mail?to=${playerNick}`)}
        className="group relative rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
        title="Send Mail"
      >
        <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Send mail to this player
        </span>
        📧
      </button>
      <button
        onClick={() => router.push(`/military?attack=${playerNick}`)}
        className="group relative rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
        title="Attack"
      >
        <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Attack this player
        </span>
        ⚔️
      </button>
      <button
        onClick={() => router.push(`/military?defend=${playerNick}`)}
        className="group relative rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-600"
        title="Defend"
      >
        <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Send reinforcements to this player
        </span>
        🛡️
      </button>
    </div>
  );
};

export default RankingActions;
