import type { PaPlayer } from "@/components/Production/Production";
import { PaUsers } from "@prisma/client";

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
export const Stringifier = ({ value }: IStringifierProps) => {
  let stringifiedValue: string;
  // We check if the value is a string, number or bigint. If it is, we convert it to a string. Otherwise, we set it to an empty string.
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
};

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
  // We filter out NaN values because if the player has no resources, the division will result in NaN.
  const filteredMaxValues = maxValues.filter((value) => !isNaN(value));
  // We use Math.min to determine the maximum number of units that can be trained.
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
  costCrystal: number,
  costTitanium: number,
  quantity?: number
): boolean => {
  const trainQuantity = quantity || 1;
  const crystalCost = trainQuantity * costCrystal;
  const titaniumCost = trainQuantity * costTitanium;

  return (
    (costCrystal === 0 || crystalCost <= paPlayer.crystal) &&
    (costTitanium === 0 || titaniumCost <= paPlayer.metal)
  );
};

/**
 * Renders income data based on the given player object
 * @param {PaUsers} paPlayer - The player object containing asteroid_metal and civilians properties
 * @returns {Object} - The income data object containing labels, datasets and their respective data
 */
export const renderIncomeData = (paPlayer: PaUsers) => {
  const tax = 20; // Set your tax value here
  const sats = 5; // Set your sats value here
  const extraTitanium = 1; // Set your extraTitanium value here
  const extraCrystal = 1; // Set your extraCrystal value here

  const civilians = paPlayer.civilians || 1000;
  const metalroid = paPlayer.asteroid_metal;

  const incomeCredits = Math.floor((civilians * tax) / 100);
  const incomeCreditsWithBonus =
    extraCrystal === 1
      ? incomeCredits + Math.floor(incomeCredits * 0.1)
      : incomeCredits;
  const incomeTitanium =
    metalroid * 60 + (extraTitanium === 1 ? Math.floor(metalroid * 0.1) : 0);
  const incomeEnergy = sats * 45;

  const data = {
    labels: ["Titanium", "Credits", "Energy"],
    datasets: [
      {
        label: "Income",
        data: [incomeTitanium, incomeCreditsWithBonus, incomeEnergy],
        backgroundColor: ["rgba(59, 113, 202, 1)"],
        borderColor: ["rgba(255,255,255,1)"],
        borderWidth: 2,
      },
    ],
  };

  return data;
};
