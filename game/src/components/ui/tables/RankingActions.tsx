import type { FC } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
interface RankingActionsProps {
  playerNick: string;
  newbie?: number;
}

// TODO: Set this to true for production
const ENABLE_NEWBIE_PROTECTION = false;

const RankingActions: FC<RankingActionsProps> = ({ playerNick, newbie = 0 }) => {
  const router = useRouter();
  const { user } = useUser();

  // Don't show actions for the current user
  if (user?.username === playerNick) {
    return null;
  }

  const isProtected = ENABLE_NEWBIE_PROTECTION && newbie > 0;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => router.push(`/mail?to=${playerNick}`)}
        className="group relative rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
        title="Send Mail"
      >
        <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Write a message to this player
        </span>
        📧
      </button>
      <button
        onClick={() => router.push(`/military?target=${playerNick}&action=attack`)}
        className="group relative rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
        title="Attack"
        disabled={isProtected}
      >
        <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          {isProtected 
            ? `Player is protected for ${newbie} more ticks`
            : "Send your troops to attack this player"}
        </span>
        ⚔️
      </button>
      <button
        onClick={() => router.push(`/military?target=${playerNick}&action=defend`)}
        className="group relative rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-600"
        title="Defend"
      >
        <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
          Send your troops to defend this player
        </span>
        🛡️
      </button>
    </div>
  );
};

export default RankingActions;
