import type { Building } from "../types/types";

export const BUILDINGS: Building[] = [
  {
    buildingId: 1,
    buildingName: "Improved tax revenue",
    buildingDescription: "Increase tax revenue by 10%",
    buildingFieldName: "r_imcrystal",
    buildingETA: 25,
    buildingCost: "1000c",
  },
  {
    buildingId: 2,
    buildingName: "Advanced titanium extractor",
    buildingDescription:
      "Enhances existing titanium extractors and increases output by 10%",
    buildingFieldName: "r_immetal",
    buildingETA: 25,
    buildingCost: "1000t",
  },
  {
    buildingId: 3,
    buildingName: "Fusion power plant",
    buildingDescription:
      "Fusion power plants generate energy to be used mainly for military purposes",
    buildingFieldName: "r_energy",
    buildingETA: 50,
    buildingCost: "5000t",
  },
  {
    buildingId: 4,
    buildingName: "Advanced tank building",
    buildingDescription: "Enable production of goliaths and grabbers",
    buildingFieldName: "r_aaircraft",
    buildingETA: 60,
    buildingCost: "5000t 5000c",
  },
  {
    buildingId: 5,
    buildingName: "EMP beam studies",
    buildingDescription: "Enable production of the medusa",
    buildingFieldName: "r_tbeam",
    buildingETA: 40,
    buildingCost: "5000c 3000t",
  },
  {
    buildingId: 6,
    buildingName: "Unit infiltration",
    buildingDescription: "Enable unit infiltration",
    buildingFieldName: "r_uscan",
    buildingETA: 60,
    buildingCost: "10000c 10000t",
  },
  {
    buildingId: 7,
    buildingName: "BDU studies",
    buildingDescription: "Enable Base Defence Units",
    buildingFieldName: "r_odg",
    buildingETA: 60,
    buildingCost: "10000t 10000c",
  },
  {
    buildingId: 8,
    buildingName: "BDU infiltration",
    buildingDescription: "Enable BDU infiltration",
    buildingFieldName: "r_oscan",
    buildingETA: 120,
    buildingCost: "20000c 20000t",
  },
];
