import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import { type FC } from "react";

import { PRODUCTION } from "./constants/PRODUCTION";

import { api } from "@/utils/api";

interface PaPlayer {
  id: number;
  c_crystal: number;
  c_metal: number;
  c_energy: number;
  c_airport: number;
  c_abase: number;
  c_destfact: number;
  c_scorpfact: number;

  [key: string]: any; // TODO Improve this later
}

interface BuildingRowProps {
  paPlayer: PaPlayer;
  building: any;
}

interface ConstructProps {
  paPlayer: PaPlayer;
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
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {building.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        <span className="w-[12.5rem]">{building.buildingDescription}</span>
      </td>
      <td
        data-th="ETA"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {paPlayer[building.buildingFieldName] >= 2
          ? paPlayer[building.buildingFieldName] - 1
          : building.buildingETA}
      </td>
      <td
        data-th="Production"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {isLoading && "Starting construction ..."}
        {paPlayer[building.buildingFieldName] === 0 && !isLoading && (
          <>
            <input
              type="text"
              aria-label="Amount"
              className="peer block min-h-[auto] w-32 relative rounded border-1 bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
              id="exampleFormControlInput1"
              placeholder="Amount"
            />
           
          </>
        )}

        {paPlayer[building.buildingFieldName] >= 2 && "Producing ..."}
        {paPlayer[building.buildingFieldName] === 1 && "Done"}
      </td>
      <td
        data-th="Cost"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
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
            Amount
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Cost
          </th>
        </tr>
        {PRODUCTION.map((building) => (
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

const Production: FC<ConstructProps> = ({ paPlayer }) => (
  <BuildingTable paPlayer={paPlayer} />

);

export default Production;
