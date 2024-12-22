import type { PaPlayer } from "@/components/features/Military/Military";
import type { IProduction } from "@/components/features/Production/types/types";
import type { PaUsers } from "@prisma/client";

// Extended type that includes construction fields directly
type PaUserWithConstruct = PaUsers & {
  c_crystal: number;
  c_metal: number;
  c_airport: number;
  c_abase: number;
  c_wstation: number;
  c_amp1: number;
  c_amp2: number;
  c_warfactory: number;
  c_destfact: number;
  c_scorpfact: number;
  c_energy: number;
  c_odg: number;
};

interface IStringifierProps {
  value?: unknown;
}

interface IRenderMessageProps {
  title: string;
  message: string;
}

/**
 * Calculates the amount of land discovered based on the number of search attempts.
 *
 * @param {number} searchAttempts - The number of search attempts made.
 * @return {number} The total amount of land discovered.
 */
export const calculateLand = (searchAttempts: number): number => {
  let totalLand = 0;

  for (
    let currentAttempt = 0;
    currentAttempt < searchAttempts;
    currentAttempt++
  ) {
    const randomFactor = Math.floor(Math.random() * (2 + totalLand));
    if (randomFactor < 20) {
      totalLand++;
    }
  }

  return totalLand;
};

/**
 * Renders a message component with a title and a message.
 *
 * @param {IRenderMessageProps} props - The properties of the message component.
 * @param {string} props.title - The title of the message.
 * @param {string} props.message - The content of the message.
 * @return {JSX.Element} The rendered message component.
 */
export const renderMessage = ({ title, message }: IRenderMessageProps) => {
  return (
    <>
      <h1 className="mt-6 text-center text-2xl font-bold text-white">
        {title}
      </h1>
      <div className="mb-4 mt-6 w-[20.625rem] rounded bg-white px-8 py-5 shadow-md md:w-[47.125rem]">
        <h2 className="text-md p-2 text-center text-black md:text-lg">
          {message}
        </h2>
      </div>
    </>
  );
};

/**
 * Determines if a string is valid JSON or not.
 * @param {string} str - The string to be validated.
 * @returns {boolean} - Returns true if the string is valid JSON, false otherwise.
 */
export const isJSON = (str: string): boolean => {
  let value: unknown = str;
  try {
    value = JSON.parse(str);
  } catch (err) {
    return false;
  }
  return typeof value === "object" && value !== null;
};

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
  return <span className="max-w-[12rem] pl-8 md:pl-0">{stringifiedValue}</span>;
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
      Math.floor(paPlayer.metal / production.buildingCostTitanium),
    );
  }
  // We filter out NaN values because if the player has no resources, the division will result in NaN.
  const filteredMaxValues = maxValues.filter((value) => !isNaN(value));
  // We use Math.min to determine the maximum number of units that can be trained.
  return Math.min(...filteredMaxValues);
};

/**
 * Checks if a player can afford to train a unit.
 *
 * @param {PaPlayer[]} paPlayer - The array of players.
 * @param {number} costCrystal - The cost of crystal.
 * @param {number} costTitanium - The cost of titanium.
 * @param {number} [unitAmount=1] - The amount of units to train.
 * @param {boolean} [considerLand=false] - Whether to consider land availability.
 * @returns {boolean} Returns true if the player can afford to train the unit, otherwise false.
 */
export const canAffordToTrain = (
  paPlayer: PaPlayer[],
  costCrystal: number,
  costTitanium: number,
  unitAmount: number,
  considerLand: boolean = false,
): boolean => {
  unitAmount = unitAmount || 1;

  const crystalCost = unitAmount * costCrystal;
  const titaniumCost = unitAmount * costTitanium;

  if (!paPlayer[0]) return false;

  if (
    (costCrystal === 0 || crystalCost <= paPlayer[0].crystal) &&
    (costTitanium === 0 || titaniumCost <= paPlayer[0].metal)
  ) {
    if (considerLand && unitAmount > paPlayer[0].ui_roids) {
      return false;
    }
    return (
      paPlayer[0].crystal - crystalCost >= 0 &&
      paPlayer[0].metal - titaniumCost >= 0
    );
  }

  return false;
};

/**
 * Renders income data based on the given player object
 * @param {PaUsers} paPlayer - The player object containing asteroid_metal and civilians properties
 * @returns {Object} - The income data object containing labels, datasets and their respective data
 */
export const renderIncomeData = (paPlayer: PaUserWithConstruct) => {
  const { sats } = paPlayer;

  const tax = 20;
  const extraTitanium = paPlayer.r_immetal ? 1 : 0;
  const extraCrystal = paPlayer.r_imcrystal ? 1 : 0;

  console.log("Extra crystal:", extraCrystal)

  const civilians = paPlayer.civilians || 1000;
  const metalroid = paPlayer.asteroid_metal;

  const incomeCredits = Math.floor((civilians * tax) / 100);

  const incomeCreditsWithTest =
  extraCrystal === 1
    ? incomeCredits + Math.floor(incomeCredits * 0.1)
    : incomeCredits;

    console.log("Extra crystal bonus:", incomeCreditsWithTest)




  /*

  const incomeCreditsWithBonus =
    extraCrystal === 1
      ? incomeCredits + Math.floor(incomeCredits * 0.1)
      : incomeCredits;

      */

  const incomeCreditsWithBonus = incomeCredits;

  const incomeTitanium =
    metalroid * 60 + (extraTitanium === 1 ? Math.floor(metalroid * 0.1) : 0);
  const incomeEnergy = sats * 45;

  return {
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
};

/**
 * Calculates the total count of ships for a given PaUsers object.
 * @param {PaUsers} paPlayer - The PaUsers object to calculate the ship count for.
 * @returns {number} The total count of ships for the given PaUsers object.
 */
export const getShipCount = (paPlayer: PaPlayer) => {
  const shipProperties = [
    "astropods",
    "infinitys",
    "wraiths",
    "warfrigs",
    "destroyers",
    "scorpions",
  ];
  return shipProperties.reduce(
    (count, property) => count + Number(paPlayer[property]),
    0,
  );
};
