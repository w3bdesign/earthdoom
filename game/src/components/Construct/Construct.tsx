import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import type { FC } from "react";
import type { PaUsers } from "@prisma/client";
import { type Building } from "./types/types";

import { BUILDINGS } from "./constants/BUILDINGS";

import { api } from "@/utils/api";
import { canAffordToTrain } from "@/utils/functions";
import { PaPlayer } from "../Production/Production";

interface BuildingRowProps {
  paPlayer: PaPlayer;
  building: Building;
}

interface ConstructProps {
  paPlayer: PaUsers;
}

const BuildingRow: FC<BuildingRowProps> = ({ paPlayer, building }) => {
  const ctx = api.useContext();
  const { user, isLoaded } = useUser();

  const constructionToast = () => toast("Construction started");
  const errorToast = () => toast("Database error");

  const { mutate, isLoading } = api.paUsers.constructBuilding.useMutation({
    onSuccess: async () => {
      constructionToast();
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      errorToast();
    },
  });

  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <tr
      key={building.buildingName}
      className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
    >
      <td
        data-th="Name"
        className="flex md:h-12 items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {building.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex md:h-12 items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        <span className="w-[12.5rem]">{building.buildingDescription}</span>
      </td>
      <td
        data-th="ETA"
        className="flex md:h-12 items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {Number(paPlayer[building.buildingFieldName]) >= 2
          ? Number(paPlayer[building.buildingFieldName]) - 1
          : building.buildingETA}
      </td>
      <td
        data-th="Cost"
        className="flex md:h-12 items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {building.buildingCost}
      </td>
      <td
        data-th="Build"
        className="flex md:h-12 items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {isLoading && "Starting ..."}

        {paPlayer[building.buildingFieldName] === 0 && !isLoading && (
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] disabled:opacity-50"
            disabled={
              !canAffordToTrain(
                paPlayer,
                building.buildingCostCrystal,
                building.buildingCostTitanium
              )
            }
            onClick={() => {
              mutate({
                Userid: paPlayer.id,
                buildingFieldName: building.buildingFieldName,
                buildingETA: building.buildingETA,
                buildingCostCrystal: building.buildingCostCrystal,
                buildingCostTitanium: building.buildingCostTitanium,
              });
            }}
          >
            Construct
          </button>
        )}

        {Number(paPlayer[building.buildingFieldName]) >= 2 && "Building ..."}
        {paPlayer[building.buildingFieldName] === 1 && "Done"}
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
            Cost
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Build
          </th>
        </tr>
        {BUILDINGS.map((building) => (
          <BuildingRow
            key={building.buildingId}
            paPlayer={paPlayer}
            building={building}
          />
        ))}
      </tbody>
    </table>
  );
};

const Construct: FC<ConstructProps> = ({ paPlayer }) => (
  <BuildingTable paPlayer={paPlayer} />
);

export default Construct;
