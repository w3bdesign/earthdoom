import { type FC } from "react";

import { BUILDINGS } from "@/components/Construct/constants/buildings";

import { api } from "@/utils/api";

import { type Building } from "./types/types";

interface BuildingRowProps {
  paPlayer: { id: number };
  building: Building;
}

interface ConstructProps {
  paPlayer: { id: number };
}

const BuildingRow: FC<BuildingRowProps> = ({ paPlayer, building }) => {
  const { mutate } = api.paUsers.constructBuilding.useMutation({
    onSuccess: () => {
      alert("Great success");
    },
    onError: (error) => {
      alert(JSON.stringify(error));
    },
  });

  return (
    <tr
      key={building.buildingName}
      className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
    >
      <td
        data-th="Name"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {building.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        <span className="w-[12.5rem]">{building.buildingDescription}</span>
      </td>
      <td
        data-th="ETA"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {building.buildingETA}
      </td>
      <td
        data-th="Build"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        <button
          type="button"
          className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
          onClick={() => {
            mutate({
              Userid: paPlayer.id,
              buildingFieldName: building.buildingFieldName,
              buildingETA: building.buildingETA,
            });
          }}
        >
          Construct
        </button>
      </td>
      <td
        data-th="Cost"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {building.buildingCost}
      </td>
    </tr>
  );
};

const BuildingTable: FC<ConstructProps> = ({ paPlayer }) => {
  return (
    <table className="w-full text-left ring-1 ring-slate-400/10">
      <tbody>
        <tr>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Name
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Description
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90  px-6 text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            ETA
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Build
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Cost
          </th>
        </tr>
        {BUILDINGS.map((building) => (
          <BuildingRow paPlayer={paPlayer} building={building} />
        ))}
      </tbody>
    </table>
  );
};

const Construct: FC<ConstructProps> = ({ paPlayer }) => (
  <BuildingTable paPlayer={paPlayer} />
);

export default Construct;
