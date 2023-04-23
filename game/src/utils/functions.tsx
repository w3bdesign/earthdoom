import type { PaPlayer } from "@/components/Production/Production";

interface IStringifierProps {
  value?: unknown;
}

interface IProduction {
  buildingId: number;
  buildingName: string;
  buildingDescription: string;
  buildingFieldName: string;
  buildingFieldNameETA?: string;
  buildingETA: number;
  buildingConstruct?: JSX.Element;
  buildingCost: string;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
}

/**
 * Converts a value to a string and renders it as a React element.
 * @param {IStringifierProps} props - The props for the component
 * @returns {JSX.Element} The stringified value as a React element
 */
export function Stringifier({ value }: IStringifierProps) {
  let stringifiedValue: string;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint"
  ) {
    stringifiedValue = String(value);
  } else {
    stringifiedValue = "";
  }
  return <span>{stringifiedValue}</span>;
}

/**
 * Calculates the maximum number of units that can be trained based on the player's resources and the production cost of the unit.
 * @param {PaUsers} paPlayer - The player.
 * @param {IProduction} production - The production cost of the unit.
 * @returns {number} - The maximum number of units that can be trained.
 */
export const maximumToTrain = (paPlayer: PaPlayer, production: IProduction) => {
  const maxValues = [];
  maxValues.push(Math.floor(paPlayer.crystal / production.buildingCostCrystal));
  if (production.buildingCostTitanium !== 0) {
    maxValues.push(
      Math.floor(paPlayer.metal / production.buildingCostTitanium)
    );
  }
  const filteredMaxValues = maxValues.filter((value) => !isNaN(value));
  const maximumAmount = Math.min(...filteredMaxValues);
  return maximumAmount;
};

/**
 * Determines if the player can afford to train a certain quantity of units based on the player's resources and the production cost of the units.
 * @param {PaUsers} paPlayer - The player.
 * @param {number} quantity - The quantity of units to be trained.
 * @param {number} costCrystal - The production cost of the unit in crystals.
 * @param {number} costTitanium - The production cost of the unit in titanium.
 * @returns {boolean} - True if the player can afford to train the units, false otherwise.
 */
export const canAffordToTrain = (
  paPlayer: PaPlayer,
  quantity: number,
  costCrystal: number,
  costTitanium: number
): boolean => {
  const crystalCost = quantity * costCrystal;
  const titaniumCost = quantity * costTitanium;

  return (
    (costCrystal === 0 || crystalCost <= paPlayer.crystal) &&
    (costTitanium === 0 || titaniumCost <= paPlayer.metal)
  );
};
