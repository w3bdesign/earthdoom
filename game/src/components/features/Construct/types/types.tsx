import type { ReactElement } from "react";

export interface Building {
  [key: string]: string | number | ReactElement | undefined;
  buildingId: number;
  buildingName: string;
  buildingDescription: string;
  buildingFieldName: string;
  buildingETA: number;
  buildingConstruct?: ReactElement;
  buildingCost: string;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
  hasInputField?: number;
  needsFieldName?: number | string;
}
