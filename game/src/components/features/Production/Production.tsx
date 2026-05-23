import { useUser } from "@clerk/nextjs";
import { useRef } from "react";

import { Button, ToastComponent } from "@/components/ui";

import type { FC, RefObject } from "react";
import type { IProduction } from "./types/types";
import type { PaPlayer } from "@/types/player";

import { PRODUCTION } from "./constants/PRODUCTION";

import { api } from "@/utils/api";

import { canAffordToTrain, maximumToTrain } from "@/utils/functions";

interface BuildingRowProps {
  paPlayer: PaPlayer;
  production: IProduction;
}

export interface ConstructProps {
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
  if (production.buildingCostCrystal > 0 && paPlayer.crystal < production.buildingCostCrystal) {
    parts.push(
      `Need ${production.buildingCostCrystal} credits (have ${paPlayer.crystal})`,
    );
  }
  if (production.buildingCostTitanium > 0 && paPlayer.metal < production.buildingCostTitanium) {
    parts.push(
      `Need ${production.buildingCostTitanium} titanium (have ${paPlayer.metal})`,
    );
  }
  return parts.length > 0 ? parts.join(". ") : "You cannot afford this";
}

/** Validate inputs and trigger the mutation */
function handleTrainClick(
  paPlayer: PaPlayer,
  production: IProduction,
  unitAmountRef: RefObject<HTMLInputElement>,
  mutate: (input: {
    buildingFieldName: string;
    buildingFieldNameETA: string;
    buildingCostCrystal: number;
    buildingCostTitanium: number;
    unitAmount: number;
    buildingETA: number;
  }) => void,
): void {
  if (!paPlayer?.id) return;

  const amount = Number(unitAmountRef?.current?.value) || 0;

  if (amount === 0) {
    ToastComponent({ message: "Needs to be more than 0", type: "error" });
    return;
  }

  if (!canAffordToTrain([paPlayer], production.buildingCostCrystal, production.buildingCostTitanium, amount)) {
    ToastComponent({ message: "You can not afford this", type: "error" });
    return;
  }

  mutate({
    buildingFieldName: production.buildingFieldName,
    buildingFieldNameETA: production.buildingFieldNameETA,
    buildingCostCrystal: production.buildingCostCrystal,
    buildingCostTitanium: production.buildingCostTitanium,
    unitAmount: amount,
    buildingETA: production.buildingETA,
  });
}

/** Determine the ETA cell value */
function getETADisplay(paPlayer: PaPlayer, production: IProduction): number {
  if (Number(paPlayer[production.buildingFieldName]) >= 1) {
    return paPlayer[production.buildingFieldNameETA] as number;
  }
  return production.buildingETA;
}

/** Determine the status text for a production field already in progress */
function getProductionStatus(paPlayer: PaPlayer, production: IProduction): string | null {
  const fieldValue = Number(paPlayer[production.buildingFieldName]);
  if (fieldValue >= 1) return `ETA ${Number(paPlayer[production.buildingFieldNameETA])} ticks`;
  return null;
}

const TD_CLASS =
  "flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell sm:border-l sm:border-t sm:before:content-none md:h-12";

const ProductionRow: FC<BuildingRowProps> = ({ paPlayer, production }) => {
  const ctx = api.useContext();
  const { isLoaded } = useUser();
  const unitAmountRef = useRef<HTMLInputElement>(null);

  const { mutate, isLoading } = api.paUsers.produceUnit.useMutation({
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
  const tooltip = buildProductionTooltip(isLoading, canAffordOne, paPlayer, production);
  const fieldValue = Number(paPlayer[production.buildingFieldName]);
  const isIdle = paPlayer[production.buildingFieldName] === 0 && !isLoading;
  const productionStatus = getProductionStatus(paPlayer, production);

  return (
    <tr
      key={production.buildingName}
      className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
    >
      <td data-th="Name" className={TD_CLASS}>
        {production.buildingName}
      </td>
      <td data-th="Info" className={TD_CLASS}>
        <span className="w-[12.5rem]">{production.buildingDescription}</span>
      </td>
      <td data-th="ETA" className={TD_CLASS}>
        {getETADisplay(paPlayer, production)}
      </td>
      <td data-th="Production" className={TD_CLASS}>
        {fieldValue > 0 && paPlayer[production.buildingFieldName]}
        {isLoading && "Starting ..."}
        {isIdle && (
          <input
            type="number"
            aria-label="Amount"
            className="border-1 peer relative block min-h-[auto] w-32 rounded bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlInput1"
            placeholder="Amount"
            ref={unitAmountRef}
            defaultValue={maximumToTrain(paPlayer, production)}
            min="0"
          />
        )}
      </td>
      <td data-th="Cost" className={TD_CLASS}>
        {production.buildingCost}
      </td>
      <td
        data-th="Build"
        className={`${TD_CLASS} md:w-[8rem] md:px-4`}
      >
        {isLoading && <div className="mb-1">Starting ...</div>}
        {isIdle && (
          <div title={tooltip} className="inline-block">
            <Button
              disabled={isDisabled}
              onClick={() => handleTrainClick(paPlayer, production, unitAmountRef, mutate)}
            >
              Train
            </Button>
          </div>
        )}
        {productionStatus}
      </td>
    </tr>
  );
};

const ProductionTable: FC<ConstructProps> = ({ paPlayer }) => {
  return (
    <table className="mt-2 w-full text-left ring-1 ring-slate-400/10">
      <tbody>
        <tr>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Name
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Description
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90  px-6 text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            ETA
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Amount
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Cost
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Train
          </th>
        </tr>
        {PRODUCTION.map((production) => (
          <ProductionRow
            key={production.buildingId}
            paPlayer={paPlayer}
            production={production}
          />
        ))}
      </tbody>
    </table>
  );
};

const Production: FC<ConstructProps> = ({ paPlayer }) => (
  <ProductionTable paPlayer={paPlayer} />
);

export default Production;
