import type { FC } from "react";
import type { PaPlayer } from "@/types/player";

import { LuShield } from "react-icons/lu";

import { formatCompact, formatNumber } from "@/utils/functions";

interface ResourceBarProps {
  paPlayer: PaPlayer;
}

interface ResourceProps {
  label: string;
  value: number;
  dot?: string;
  detail?: string;
}

const Resource: FC<ResourceProps> = ({ label, value, dot, detail }) => (
  <div className="flex min-w-0 flex-col" title={detail}>
    <dt className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-muted md:text-xs">
      {dot && <span aria-hidden className={`h-2 w-2 rounded-full ${dot}`} />}
      {label}
    </dt>
    <dd className="text-sm font-semibold text-ink tabular-nums md:text-base">
      <span className="md:hidden">{formatCompact(value)}</span>
      <span className="hidden md:inline">{formatNumber(value)}</span>
      {detail && <span className="sr-only"> ({detail})</span>}
    </dd>
  </div>
);

/**
 * The player's resources, land and rank, kept in view at the top of every page.
 *
 * @param {ResourceBarProps} props - The player to show.
 * @return {JSX.Element} The resource bar.
 */
const ResourceBar: FC<ResourceBarProps> = ({ paPlayer }) => {
  const land =
    paPlayer.asteroid_crystal + paPlayer.asteroid_metal + paPlayer.ui_roids;
  const landDetail = `${formatNumber(paPlayer.asteroid_crystal)} houses, ${formatNumber(
    paPlayer.asteroid_metal,
  )} mines, ${formatNumber(paPlayer.ui_roids)} undeveloped`;
  const protectedTicks = Number(paPlayer.newbie ?? 0);

  return (
    <div className="sticky top-0 z-20 border-b border-line bg-ground/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5 md:px-8">
        <dl
          aria-label={`Resources for ${paPlayer.nick}`}
          className="grid flex-1 grid-cols-5 gap-3 md:flex md:gap-8"
        >
          <Resource label="Credits" value={paPlayer.crystal} dot="bg-credits" />
          <Resource label="Titanium" value={paPlayer.metal} dot="bg-titanium" />
          <Resource label="Energy" value={paPlayer.energy} dot="bg-energy" />
          <Resource label="Land" value={land} detail={landDetail} />
          <Resource label="Rank" value={paPlayer.rank} />
        </dl>
        {protectedTicks > 0 && (
          <span
            className="hidden items-center gap-1.5 rounded-full border border-friendly/40 bg-friendly/10 px-2.5 py-1 text-xs font-medium text-friendly sm:inline-flex"
            title="Other players cannot attack you while you are protected"
          >
            <LuShield aria-hidden className="h-3.5 w-3.5" />
            Protected · {protectedTicks} ticks
          </span>
        )}
      </div>
    </div>
  );
};

export default ResourceBar;
