export interface Building {
  [key: string]: string | number;
  buildingId: number;
  buildingName: string;
  buildingDescription: string;
  buildingFieldName: string;
  buildingETA: number;
  buildingConstruct?: any;//JSX.Element;
  buildingCost: string;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
}
