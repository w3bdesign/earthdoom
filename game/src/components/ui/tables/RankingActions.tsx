import type { FC } from "react";
import type { IconType } from "react-icons";
import type { PaPlayerBase } from "@/types/player";

import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { LuMail, LuSwords, LuShield } from "react-icons/lu";

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
  icon: IconType;
  disabled?: boolean;
}

// TODO: Set this to true for production
const ENABLE_NEWBIE_PROTECTION = false;

const BASE_CLASS =
  "inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const ActionButton: FC<ActionButtonProps> = ({
  onClick,
  className,
  title,
  tooltip,
  icon: Icon,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`${BASE_CLASS} ${className}`}
    title={tooltip}
    aria-label={tooltip}
    disabled={disabled}
  >
    <Icon aria-hidden className="h-4 w-4" />
    <span className="hidden sm:inline lg:hidden xl:inline">{title}</span>
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
    return <span className="text-sm text-muted">You</span>;
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
    : `Attack ${playerNick}`;

  return (
    <div className="flex items-center gap-2">
      <ActionButton
        onClick={navigateToMail}
        className="border-line-strong bg-raised text-ink hover:bg-line"
        title="Mail"
        tooltip={`Mail ${playerNick}`}
        icon={LuMail}
      />
      {hasTroops && (
        <>
          <ActionButton
            onClick={navigateToAttack}
            className="border-hostile/40 bg-hostile/10 text-hostile hover:bg-hostile/20"
            title="Attack"
            tooltip={attackTooltip}
            icon={LuSwords}
            disabled={isProtected}
          />
          <ActionButton
            onClick={navigateToDefend}
            className="border-friendly/35 bg-friendly/10 text-friendly hover:bg-friendly/20"
            title="Defend"
            tooltip={`Defend ${playerNick}`}
            icon={LuShield}
          />
        </>
      )}
    </div>
  );
};

export default RankingActions;
