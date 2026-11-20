import type { PaPlayerBase } from "@/types/player";

import { formatNumber } from "@/utils/functions";

interface CostProps {
  crystal: number;
  titanium: number;
  player?: PaPlayerBase;
}

/** A building or unit price in credits and titanium, red where the player is short. */
const Cost = ({ crystal, titanium, player }: CostProps) => {
  if (crystal === 0 && titanium === 0) {
    return <span className="text-friendly">Free</span>;
  }
  const parts = [
    {
      amount: crystal,
      have: player?.crystal,
      label: "credits",
      dot: "bg-credits",
    },
    {
      amount: titanium,
      have: player?.metal,
      label: "titanium",
      dot: "bg-titanium",
    },
  ].filter(({ amount }) => amount > 0);

  return (
    <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
      {parts.map(({ amount, have, label, dot }) => {
        const short = have !== undefined && have < amount;
        return (
          <span
            key={label}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap ${short ? "text-hostile" : "text-ink"}`}
          >
            <span aria-hidden className={`h-2 w-2 rounded-full ${dot}`} />
            {formatNumber(amount)} {label}
          </span>
        );
      })}
    </span>
  );
};

export default Cost;
