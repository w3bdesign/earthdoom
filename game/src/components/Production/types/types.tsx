export interface IProduction {
  buildingId: number;
  buildingName: string;
  buildingDescription: string;
  buildingFieldName: string;
  buildingFieldNameETA: string;
  buildingETA: number;
  buildingConstruct?: JSX.Element;
  buildingCost: string;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
}
