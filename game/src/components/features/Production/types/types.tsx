import type { ReactElement } from "react";

export interface IProduction {
  buildingId: number;
  buildingName: string;
  buildingDescription: string;
  buildingFieldName: string;
  buildingFieldNameETA: string;
  buildingRequirement: string;
  buildingETA: number;
  buildingConstruct?: ReactElement;
  buildingCost: string;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
}
