import type { RefObject } from "react";
import type { FC } from "react";
import type { Building } from "@/components/features/Construct/types/types";
import type { PaPlayer } from "@/components/features/Military/Military";
import type { TMutateType } from "./AdvancedDataTable";

import Button from "../../../common/Button";
import ToastComponent from "../../notifications/ToastComponent";

import { canAffordToTrain } from "@/utils/functions";

interface IActionButtonProps {
  isLoading: boolean;
  paPlayer: PaPlayer[];
  building?: Building;
  canAffordToTrain: typeof canAffordToTrain;
  mutate: TMutateType;
  actionText?: string;
  actionInProgress?: string;
  inputAmountRef?: RefObject<HTMLInputElement>;
}

const ActionButton: FC<IActionButtonProps> = ({
  isLoading,
  paPlayer,
  building,
  canAffordToTrain,
  mutate,
  actionText,
  inputAmountRef,
}) => {
  if (!paPlayer[0] || !building) {
    return null;
  }

  const shouldNotCheckFieldName =
    building.needsFieldName === 0 || building.needsFieldName === "undefined";

  return (
    <>
      <td className="flex items-center px-8 text-base text-black transition duration-300 before:text-black first:border-l-0 sm:table-cell sm:before:content-none md:h-12 md:px-0">
        {(shouldNotCheckFieldName ||
          paPlayer[0][building.buildingFieldName] === 0) && (
          <Button
            disabled={isLoading}
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
                  paPlayer[0],
                  building.buildingCostCrystal,
                  building.buildingCostTitanium,
                  Number(inputAmountRef?.current?.value),
                )
              ) {
                ToastComponent({
                  message: "You can not afford this",
                  type: "error",
                });
                return;
              }

              mutate({
                Userid: Number(paPlayer[0].id),
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
