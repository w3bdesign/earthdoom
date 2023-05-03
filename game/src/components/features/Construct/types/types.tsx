export interface Building { 
  [key: string]: string | number | JSX.Element | undefined;
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