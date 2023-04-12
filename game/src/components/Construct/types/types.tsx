export interface Building {
  buildingId: number;
  buildingName: string;
  buildingDescription: string;
  buildingFieldName: string;
  buildingETA: number;
  buildingConstruct?: JSX.Element;
  buildingCost: string;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
}
