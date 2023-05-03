import { useUser } from "@clerk/nextjs";

import type { FC } from "react";
import type { PaUsers } from "@prisma/client";
import type { Building } from "./types/types";

import { Button, ToastComponent } from "@/components/ui/common";

import { BUILDINGS } from "./constants/BUILDINGS";

import { api } from "@/utils/api";
import { canAffordToTrain } from "@/utils/functions";

interface PaPlayer extends PaUsers {
  [key: string]: number | string;
}

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

  const { mutate, isLoading } = api.paUsers.constructBuilding.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Building started", type: "success" });
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
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
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {building.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        <span className="w-[12.5rem]">{building.buildingDescription}</span>
      </td>
      <td
        data-th="ETA"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {Number(paPlayer[building.buildingFieldName]) >= 2
          ? Number(paPlayer[building.buildingFieldName]) - 1
          : building.buildingETA}
      </td>
      <td
        data-th="Cost"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {building.buildingCost}
      </td>
      <td
        data-th="Build"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {isLoading && "Starting ..."}
        {paPlayer[building.buildingFieldName] === 0 && !isLoading && (
          <Button
            onClick={() => {
              if (
                !canAffordToTrain(
                  paPlayer,
                  building.buildingCostCrystal,
                  building.buildingCostTitanium
                )
              ) {
                ToastComponent({
                  message: "You can not afford this",
                  type: "error",
                });
                return;
              }
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
          </Button>
        )}
        {Number(paPlayer[building.buildingFieldName]) >= 2 && "Building ..."}
        {paPlayer[building.buildingFieldName] === 1 && "Done"}
      </td>
    </tr>
  );
};

const BuildingTable: FC<ConstructProps> = ({ paPlayer }) => {
  return (
    <table className="mt-2 w-full text-left ring-1 ring-slate-400/10">
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
