/**
 * Game facts quoted on the site. Values come from the game source
 * (game/src/components/features/*\/constants) and the manual, so the site and
 * the game agree. Update both together.
 */

export type Cost = { credits?: number; titanium?: number };

export interface Item {
  name: string;
  cost: Cost | "free";
  eta: number; // ticks
  note: string;
}

export const ECONOMY: Item[] = [
  { name: "Tax collectors", cost: "free", eta: 10, note: "Your first credits." },
  { name: "Improved tax revenue", cost: { credits: 1000 }, eta: 25, note: "Research: +10% tax." },
  { name: "Titanium extractor", cost: { credits: 500 }, eta: 20, note: "Titanium every tick." },
  { name: "Advanced titanium extractor", cost: { titanium: 1000 }, eta: 25, note: "Research: more titanium." },
];

export const UNITS: Item[] = [
  { name: "Light infantry", cost: { credits: 300 }, eta: 10, note: "Fast, good for hit and run." },
  { name: "Shadow", cost: { credits: 300 }, eta: 10, note: "Strong against Ares and Hellspawns." },
  { name: "Heavy Infantry", cost: { credits: 500 }, eta: 15, note: "Slow, built for frontal assaults." },
  { name: "Goliaths", cost: { credits: 1000 }, eta: 20, note: "The backbone of many armies." },
  { name: "Grabber", cost: { credits: 1500 }, eta: 30, note: "The only unit that claims land." },
];

/** Attack timing from the manual: travel, then fight. */
export const ATTACK = { travelTicks: 30, battleTicks: 5 };

/** Scouting cost per scout (manual: "each scout costs you 500 credits"). */
export const SCOUT_COST = 500;

export const formatNumber = (n: number) => n.toLocaleString("en-US");
