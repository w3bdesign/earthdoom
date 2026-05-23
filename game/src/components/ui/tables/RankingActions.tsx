import type { FC } from "react";
import type { PaPlayerBase } from "@/types/player";

import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

interface RankingActionsProps {
  playerNick: string;
  newbie: number;
  currentPlayer: PaPlayerBase;
}

interface ActionButtonProps {
  onClick: () => void;
  className: string;
  title: string;
  tooltip: string;
  emoji: string;
  disabled?: boolean;
}

// TODO: Set this to true for production
const ENABLE_NEWBIE_PROTECTION = false;

const ActionButton: FC<ActionButtonProps> = ({
  onClick,
  className,
  title,
  tooltip,
  emoji,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    className={className}
    title={title}
    disabled={disabled}
  >
    <span className="absolute -top-8 left-1/2 z-50 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
      {tooltip}
    </span>
    {emoji}
  </button>
);

const computeShipCount = (player: PaPlayerBase): number =>
  player.astropods +
  player.infinitys +
  player.wraiths +
  player.warfrigs +
  player.destroyers +
  player.scorpions;

const RankingActions: FC<RankingActionsProps> = ({
  playerNick,
  newbie = 0,
  currentPlayer,
}) => {
  const router = useRouter();
  const { user } = useUser();

  // Don't show actions for the current user
  if (user?.username === playerNick) {
    return null;
  }

  const hasTroops = computeShipCount(currentPlayer) > 0;
  const isProtected = ENABLE_NEWBIE_PROTECTION && newbie > 0;

  const navigateToMail = () => router.push(`/mail?nick=${playerNick}`);
  const navigateToAttack = () =>
    router.push(`/military?target=${playerNick}&action=attack`);
  const navigateToDefend = () =>
    router.push(`/military?target=${playerNick}&action=defend`);

  const attackTooltip = isProtected
    ? `Player is protected for ${newbie} more ticks`
    : "Send your troops to attack this player";

  return (
    <div className="flex items-center justify-center gap-2">
      <ActionButton
        onClick={navigateToMail}
        className="group relative rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
        title="Send Mail"
        tooltip="Send a mail"
        emoji="📧"
      />
      {hasTroops && (
        <>
          <ActionButton
            onClick={navigateToAttack}
            className="group relative rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            title="Attack"
            tooltip={attackTooltip}
            emoji="⚔️"
            disabled={isProtected}
          />
          <ActionButton
            onClick={navigateToDefend}
            className="group relative rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-600"
            title="Defend"
            tooltip="Send your troops to defend this player"
            emoji="🛡️"
          />
        </>
      )}
    </div>
  );
};

export default RankingActions;
