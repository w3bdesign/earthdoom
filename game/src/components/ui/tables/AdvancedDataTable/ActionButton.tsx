import type { RefObject } from "react";
import type { FC } from "react";
import type { Building } from "@/components/features/Construct/types/types";
import type { PaPlayerBase } from "@/types/player";
import type { TMutateType } from "./AdvancedDataTable";

import Button from "../../../common/Button";
import ToastComponent from "../../notifications/ToastComponent";

import { canAffordToTrain } from "@/utils/functions";

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

/** Determine the tooltip text based on the current disabled state */
function buildTooltip(
  isLoading: boolean,
  canAffordOne: boolean,
  player: PaPlayerBase,
  building: Building,
): string | undefined {
  if (isLoading) return "Action in progress...";
  if (canAffordOne) return undefined;

  const parts: string[] = [];
  if (
    building.buildingCostCrystal > 0 &&
    player.crystal < building.buildingCostCrystal
  ) {
    parts.push(
      `Need ${building.buildingCostCrystal} credits (have ${player.crystal})`,
    );
  }
  if (
    building.buildingCostTitanium > 0 &&
    player.metal < building.buildingCostTitanium
  ) {
    parts.push(
      `Need ${building.buildingCostTitanium} titanium (have ${player.metal})`,
    );
  }
  return parts.length > 0 ? parts.join(". ") : "You cannot afford this";
}

/** Determine if the building's field name check should be skipped */
function shouldSkipFieldNameCheck(building: Building): boolean {
  return (
    building.needsFieldName === 0 || building.needsFieldName === "undefined"
  );
}

/** Get the numeric value from the input ref, defaulting to 0 */
function getInputAmount(inputAmountRef?: RefObject<HTMLInputElement | null>): number {
  return Number(inputAmountRef?.current?.value) || 0;
}

/** Determine the status text for in-progress or completed buildings */
function getStatusText(
  player: PaPlayerBase,
  building: Building,
): string | null {
  const fieldValue = Number(player[building.buildingFieldName]);
  if (fieldValue >= 2) return `${fieldValue} ticks left`;
  if (fieldValue === 1) return "Done";
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
    Number(building.hasInputField) === 1 ||
    building.hasInputField !== "undefined";

  const amount = getInputAmount(inputAmountRef);

  if (hasInputField && amount === 0) {
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
  inputAmountRef,
  disabled,
  considerLand,
}) => {
  const player = paPlayer[0];
  if (!player || !building) {
    return null;
  }

  const skipFieldNameCheck = shouldSkipFieldNameCheck(building);

  const canAffordOne = canAffordToTrain(
    paPlayer,
    building.buildingCostCrystal,
    building.buildingCostTitanium,
    1,
    considerLand,
  );

  const isDisabled = isLoading || disabled || !canAffordOne;
  const tooltip = buildTooltip(isLoading, canAffordOne, player, building);

  const showButton =
    skipFieldNameCheck || player[building.buildingFieldName] === 0;
  const statusText = !skipFieldNameCheck
    ? getStatusText(player, building)
    : null;

  return (
    <>
      <td className="flex items-center px-8 text-base text-black transition duration-300 before:text-black first:border-l-0 sm:table-cell sm:before:content-none md:h-12 md:px-0">
        {showButton && (
          <div title={tooltip} className="inline-block">
            <Button
              disabled={isDisabled}
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
              {actionText}
            </Button>
          </div>
        )}
        {statusText}
      </td>
    </>
  );
};

export default ActionButton;
