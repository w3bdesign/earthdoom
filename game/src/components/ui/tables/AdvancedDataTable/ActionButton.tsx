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
  inputAmountRef?: RefObject<HTMLInputElement>;
  disabled?: boolean;
  considerLand?: boolean;
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
  if (!paPlayer[0] || !building) {
    return null;
  }

  const shouldNotCheckFieldName =
    building.needsFieldName === 0 || building.needsFieldName === "undefined";

  // Check if the player can afford at least one unit of this building/unit
  const canAffordOne = canAffordToTrain(
    paPlayer,
    building.buildingCostCrystal,
    building.buildingCostTitanium,
    1,
    considerLand,
  );

  const isDisabled = isLoading || disabled || !canAffordOne;

  // Build tooltip message for disabled state
  const getTooltip = (): string | undefined => {
    if (isLoading) return "Action in progress...";
    if (!canAffordOne) {
      const player = paPlayer[0];
      if (!player) return "Cannot afford this";
      const parts: string[] = [];
      if (building.buildingCostCrystal > 0 && player.crystal < building.buildingCostCrystal) {
        parts.push(
          `Need ${building.buildingCostCrystal} credits (have ${player.crystal})`,
        );
      }
      if (building.buildingCostTitanium > 0 && player.metal < building.buildingCostTitanium) {
        parts.push(
          `Need ${building.buildingCostTitanium} titanium (have ${player.metal})`,
        );
      }
      return parts.length > 0 ? parts.join(". ") : "You cannot afford this";
    }
    return undefined;
  };

  const tooltip = getTooltip();

  return (
    <>
      <td className="flex items-center px-8 text-base text-black transition duration-300 before:text-black first:border-l-0 sm:table-cell sm:before:content-none md:h-12 md:px-0">
        {(shouldNotCheckFieldName ||
          paPlayer[0][building.buildingFieldName] === 0) && (
          <div title={tooltip} className="inline-block">
            <Button
              disabled={isDisabled}
              onClick={() => {
                if (!paPlayer[0] || !paPlayer[0].id) return;

                // Using a single condition to check for multiple values
                const hasInputField =
                  Number(building.hasInputField) === 1 ||
                  building.hasInputField !== "undefined";

                if (
                  hasInputField &&
                  Number(inputAmountRef?.current?.value) === 0
                ) {
                  ToastComponent({
                    message: "Quantity needs to be more than 0",
                    type: "error",
                  });
                  return;
                }

                // Using early returns to avoid nested if statements
                if (
                  !canAffordToTrain(
                    paPlayer,
                    building.buildingCostCrystal,
                    building.buildingCostTitanium,
                    Number(inputAmountRef?.current?.value),
                    considerLand,
                  )
                ) {
                  ToastComponent({
                    message: "You can not afford this",
                    type: "error",
                  });
                  return;
                }

                mutate({
                  buildingFieldName: building.buildingFieldName,
                  buildingETA: building.buildingETA,
                  buildingCostCrystal: building.buildingCostCrystal,
                  buildingCostTitanium: building.buildingCostTitanium,
                  unitAmount: Number(inputAmountRef?.current?.value),
                });
              }}
            >
              {actionText}
            </Button>
          </div>
        )}
        {paPlayer[0] &&
          building &&
          !shouldNotCheckFieldName &&
          Number(paPlayer[0][building?.buildingFieldName]) >= 2 &&
          `${Number(paPlayer[0][building?.buildingFieldName])} ticks left`}
        {paPlayer[0] &&
          building &&
          !shouldNotCheckFieldName &&
          paPlayer[0][building.buildingFieldName] === 1 &&
          "Done"}
      </td>
    </>
  );
};

export default ActionButton;
