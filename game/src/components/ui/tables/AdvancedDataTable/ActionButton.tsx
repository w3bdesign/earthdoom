import type { RefObject } from "react";
import type { FC } from "react";
import type { Building } from "@/components/features/Construct/types/types";
import type { PaPlayerBase } from "@/types/player";
import type { TMutateType } from "./AdvancedDataTable";

import { LuCheck, LuHourglass } from "react-icons/lu";

import Button from "../../../common/Button";
import ActionStatus, { ACTION_WIDTH } from "../../ActionStatus";
import ToastComponent from "../../notifications/ToastComponent";

import { canAffordToTrain, formatNumber } from "@/utils/functions";

interface IActionButtonProps {
  isLoading: boolean;
  paPlayer: PaPlayerBase[];
  building?: Building;
  mutate: TMutateType;
  actionText?: string;
  actionInProgress?: string;
  inputAmountRef?: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  considerLand?: boolean;
}

/** Explain why the action can't be taken, e.g. "Need 1,200 more credits" */
export function buildShortfall(
  canAffordOne: boolean,
  player: PaPlayerBase,
  building: Building,
  considerLand = false,
): string | undefined {
  if (canAffordOne) return undefined;

  const parts: string[] = [];
  if (
    building.buildingCostCrystal > 0 &&
    player.crystal < building.buildingCostCrystal
  ) {
    parts.push(
      `${formatNumber(building.buildingCostCrystal - player.crystal)} more credits`,
    );
  }
  if (
    building.buildingCostTitanium > 0 &&
    player.metal < building.buildingCostTitanium
  ) {
    parts.push(
      `${formatNumber(building.buildingCostTitanium - player.metal)} more titanium`,
    );
  }
  if (parts.length > 0) return `Need ${parts.join(" and ")}`;
  if (considerLand && player.ui_roids < 1) return "No undeveloped land";
  return "You cannot afford this";
}

/** Determine if the building's field name check should be skipped */
function shouldSkipFieldNameCheck(building: Building): boolean {
  return (
    building.needsFieldName === 0 || building.needsFieldName === "undefined"
  );
}

/** Get the numeric value from the input ref, defaulting to 0 */
function getInputAmount(
  inputAmountRef?: RefObject<HTMLInputElement | null>,
): number {
  return Number(inputAmountRef?.current?.value) || 0;
}

/** The status of a building or research that was already started */
function BuildStatus({ fieldValue }: { fieldValue: number }) {
  if (fieldValue >= 2) {
    return (
      <ActionStatus tone="caution" icon={LuHourglass}>
        {fieldValue} ticks left
      </ActionStatus>
    );
  }
  if (fieldValue === 1) {
    return (
      <ActionStatus tone="friendly" icon={LuCheck}>
        Done
      </ActionStatus>
    );
  }
  return null;
}

/** Handle the click action: validate inputs and call mutate */
function handleActionClick(
  paPlayer: PaPlayerBase[],
  building: Building,
  inputAmountRef: RefObject<HTMLInputElement | null> | undefined,
  considerLand: boolean | undefined,
  mutate: TMutateType,
): void {
  const player = paPlayer[0];
  if (!player?.id) return;

  const hasInputField =
    building.hasInputField === 1 || Number(building.hasInputField) === 1;

  const amount = getInputAmount(inputAmountRef);

  if (hasInputField && amount <= 0) {
    ToastComponent({
      message: "Quantity needs to be more than 0",
      type: "error",
    });
    return;
  }

  if (
    !canAffordToTrain(
      paPlayer,
      building.buildingCostCrystal,
      building.buildingCostTitanium,
      amount,
      considerLand,
    )
  ) {
    ToastComponent({ message: "You can not afford this", type: "error" });
    return;
  }

  mutate({
    buildingFieldName: building.buildingFieldName,
    buildingETA: building.buildingETA,
    buildingCostCrystal: building.buildingCostCrystal,
    buildingCostTitanium: building.buildingCostTitanium,
    unitAmount: amount,
  });
}

const ActionButton: FC<IActionButtonProps> = ({
  isLoading,
  paPlayer,
  building,
  mutate,
  actionText,
  actionInProgress,
  inputAmountRef,
  disabled,
  considerLand,
}) => {
  const player = paPlayer[0];
  if (!player || !building) {
    return null;
  }

  const skipFieldNameCheck = shouldSkipFieldNameCheck(building);
  const showButton =
    skipFieldNameCheck || player[building.buildingFieldName] === 0;

  if (!showButton) {
    return (
      <BuildStatus fieldValue={Number(player[building.buildingFieldName])} />
    );
  }

  const canAffordOne = canAffordToTrain(
    paPlayer,
    building.buildingCostCrystal,
    building.buildingCostTitanium,
    1,
    considerLand,
  );
  const isDisabled = isLoading || disabled || !canAffordOne;
  const shortfall = buildShortfall(
    canAffordOne,
    player,
    building,
    considerLand,
  );
  const hintId = `shortfall-${building.buildingFieldName}`;

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        disabled={isDisabled}
        aria-describedby={shortfall ? hintId : undefined}
        extraClasses={ACTION_WIDTH}
        onClick={() =>
          handleActionClick(
            paPlayer,
            building,
            inputAmountRef,
            considerLand,
            mutate,
          )
        }
      >
        {isLoading && actionInProgress ? actionInProgress : actionText}
      </Button>
      {shortfall && (
        <p id={hintId} className="text-xs text-hostile">
          {shortfall}
        </p>
      )}
    </div>
  );
};

export default ActionButton;
