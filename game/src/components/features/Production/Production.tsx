import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { LuHourglass } from "react-icons/lu";

import { Button, ToastComponent } from "@/components/ui";
import ActionStatus, { ACTION_WIDTH } from "@/components/ui/ActionStatus";
import Cost from "@/components/ui/Cost";
import { INPUT_CLASS } from "@/components/ui/Field";

import type { FC, RefObject } from "react";
import type { IProduction } from "./types/types";
import type { PaPlayer } from "@/types/player";

import { PRODUCTION } from "./constants/PRODUCTION";

import { api } from "@/utils/api";

import {
  canAffordToTrain,
  formatNumber,
  maximumToTrain,
} from "@/utils/functions";

interface BuildingRowProps {
  paPlayer: PaPlayer;
  production: IProduction;
}

interface ConstructProps {
  paPlayer: PaPlayer;
}

/** Build a tooltip string explaining why the button is disabled */
function buildProductionTooltip(
  isLoading: boolean,
  canAffordOne: boolean,
  paPlayer: PaPlayer,
  production: IProduction,
): string | undefined {
  if (isLoading) return "Training in progress...";
  if (canAffordOne) return undefined;

  const parts: string[] = [];
  if (
    production.buildingCostCrystal > 0 &&
    paPlayer.crystal < production.buildingCostCrystal
  ) {
    parts.push(
      `${formatNumber(production.buildingCostCrystal - paPlayer.crystal)} more credits`,
    );
  }
  if (
    production.buildingCostTitanium > 0 &&
    paPlayer.metal < production.buildingCostTitanium
  ) {
    parts.push(
      `${formatNumber(production.buildingCostTitanium - paPlayer.metal)} more titanium`,
    );
  }
  return parts.length > 0
    ? `Need ${parts.join(" and ")}`
    : "You cannot afford this";
}

/** Validate inputs and return parsed amount, or null if invalid */
function validateTrainInput(
  paPlayer: PaPlayer,
  production: IProduction,
  unitAmountRef: RefObject<HTMLInputElement | null>,
): number | null {
  if (!paPlayer?.id) return null;

  const amount = Number(unitAmountRef?.current?.value) || 0;

  if (amount === 0) {
    ToastComponent({ message: "Needs to be more than 0", type: "error" });
    return null;
  }

  if (
    !canAffordToTrain(
      [paPlayer],
      production.buildingCostCrystal,
      production.buildingCostTitanium,
      amount,
    )
  ) {
    ToastComponent({ message: "You can not afford this", type: "error" });
    return null;
  }

  return amount;
}

/** Determine the ETA cell value */
function getETADisplay(paPlayer: PaPlayer, production: IProduction): number {
  if (Number(paPlayer[production.buildingFieldName]) >= 1) {
    return paPlayer[production.buildingFieldNameETA] as number;
  }
  return production.buildingETA;
}

/** Determine the status text for a production field already in progress */
function getProductionStatus(
  paPlayer: PaPlayer,
  production: IProduction,
): string | null {
  const fieldValue = Number(paPlayer[production.buildingFieldName]);
  if (fieldValue >= 1)
    return `ETA ${Number(paPlayer[production.buildingFieldNameETA])} ticks`;
  return null;
}

// Same table layout as AdvancedDataTable: ETA and description move under the name on narrow screens
const TD = "px-3 py-3 align-middle text-ink lg:px-4";

const ProductionRow: FC<BuildingRowProps> = ({ paPlayer, production }) => {
  const ctx = api.useContext();
  const { isLoaded } = useUser();
  const unitAmountRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending: isLoading } = api.paUsers.produceUnit.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Training started", type: "success" });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  if (paPlayer[production.buildingRequirement] === 0) {
    return null;
  }

  const canAffordOne = canAffordToTrain(
    [paPlayer],
    production.buildingCostCrystal,
    production.buildingCostTitanium,
    1,
  );

  const isDisabled = isLoading || !canAffordOne;
  const tooltip = buildProductionTooltip(
    isLoading,
    canAffordOne,
    paPlayer,
    production,
  );
  const fieldValue = Number(paPlayer[production.buildingFieldName]);
  const isIdle = paPlayer[production.buildingFieldName] === 0 && !isLoading;
  const productionStatus = getProductionStatus(paPlayer, production);

  const handleTrain = () => {
    const amount = validateTrainInput(paPlayer, production, unitAmountRef);
    if (amount === null) return;

    mutate({
      buildingFieldName: production.buildingFieldName as Parameters<
        typeof mutate
      >[0]["buildingFieldName"],
      buildingFieldNameETA: production.buildingFieldNameETA as Parameters<
        typeof mutate
      >[0]["buildingFieldNameETA"],
      buildingCostCrystal: production.buildingCostCrystal,
      buildingCostTitanium: production.buildingCostTitanium,
      unitAmount: amount,
      buildingETA: production.buildingETA,
    });
  };

  const shortfall = isIdle && !canAffordOne ? tooltip : undefined;

  return (
    <tr key={production.buildingName} className="hover:bg-white/2">
      <td className={`${TD} font-semibold`}>
        {production.buildingName}
        <span className="block text-xs font-normal text-muted md:hidden">
          {getETADisplay(paPlayer, production)} ticks
        </span>
        <span className="mt-1 block text-xs font-normal sm:hidden">
          <Cost
            crystal={production.buildingCostCrystal}
            titanium={production.buildingCostTitanium}
            player={paPlayer}
          />
        </span>
        <span className="mt-1 line-clamp-2 text-xs font-normal text-muted lg:hidden">
          {production.buildingDescription}
        </span>
      </td>
      <td className={`${TD} hidden max-w-sm text-muted lg:table-cell`}>
        {production.buildingDescription}
      </td>
      <td className={`${TD} hidden whitespace-nowrap md:table-cell`}>
        {getETADisplay(paPlayer, production)} ticks
      </td>
      <td className={`${TD} hidden sm:table-cell`}>
        <Cost
          crystal={production.buildingCostCrystal}
          titanium={production.buildingCostTitanium}
          player={paPlayer}
        />
      </td>
      <td className={TD}>
        {fieldValue > 0 && (
          <span className="tabular-nums">
            {formatNumber(Number(paPlayer[production.buildingFieldName]))} in
            training
          </span>
        )}
        {isLoading && "Starting ..."}
        {isIdle && (
          <input
            type="number"
            inputMode="numeric"
            aria-label={`Amount of ${production.buildingName}`}
            className={`${INPUT_CLASS} w-20 text-right tabular-nums sm:w-28`}
            placeholder="Amount"
            ref={unitAmountRef}
            defaultValue={maximumToTrain(paPlayer, production)}
            min="0"
          />
        )}
      </td>
      <td className={TD}>
        {isLoading && (
          <div className="mb-1 text-sm text-muted">Starting ...</div>
        )}
        {isIdle && (
          <div className="flex flex-col items-start gap-1">
            <Button
              disabled={isDisabled}
              onClick={handleTrain}
              extraClasses={ACTION_WIDTH}
            >
              Train
            </Button>
            {shortfall && <p className="text-xs text-hostile">{shortfall}</p>}
          </div>
        )}
        {productionStatus && (
          <ActionStatus tone="caution" icon={LuHourglass}>
            {productionStatus}
          </ActionStatus>
        )}
      </td>
    </tr>
  );
};

const HEADERS = [
  { label: "Name", className: "" },
  { label: "Description", className: "hidden lg:table-cell" },
  { label: "ETA", className: "hidden md:table-cell" },
  { label: "Cost", className: "hidden sm:table-cell" },
  { label: "Amount", className: "" },
  { label: "Train", className: "lg:w-40" },
];

const ProductionTable: FC<ConstructProps> = ({ paPlayer }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel shadow-panel">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Production</caption>
        <thead>
          <tr className="border-b border-line bg-raised">
            {HEADERS.map(({ label, className }) => (
              <th
                key={label}
                scope="col"
                className={`h-10 px-3 text-xs font-medium text-muted lg:px-4 ${className}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {PRODUCTION.map((production) => (
            <ProductionRow
              key={production.buildingId}
              paPlayer={paPlayer}
              production={production}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Production: FC<ConstructProps> = ({ paPlayer }) => (
  <ProductionTable paPlayer={paPlayer} />
);

export default Production;
