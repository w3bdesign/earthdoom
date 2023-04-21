import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import { type FC } from "react";
import type { PaUsers } from "@prisma/client";

import { PRODUCTION } from "./constants/PRODUCTION";

import { api } from "@/utils/api";
import { IProduction } from "./types/types";

interface PaPlayer extends PaUsers {
  [key: string]: any; // TODO Improve this later
}

interface BuildingRowProps {
  paPlayer: PaPlayer;
  production: IProduction;
}

interface ConstructProps {
  paPlayer: PaPlayer;
}

const ProductionRow: FC<BuildingRowProps> = ({ paPlayer, production }) => {
  const ctx = api.useContext();
  const { user, isLoaded } = useUser();

  const constructionToast = () => toast("Construction started");
  const errorToast = () => toast("Database error");

  const { isLoading } = api.paUsers.constructBuilding.useMutation({
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
      key={production.buildingName}
      className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
    >
      <td
        data-th="Name"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {production.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        <span className="w-[12.5rem]">{production.buildingDescription}</span>
      </td>
      <td
        data-th="ETA"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {paPlayer[production.buildingFieldName] >= 2
          ? paPlayer[production.buildingFieldName] - 1
          : production.buildingETA}
      </td>
      <td
        data-th="Production"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {isLoading && "Starting ..."}
        {paPlayer[production.buildingFieldName] === 0 && !isLoading && (
          <input
            type="text"
            aria-label="Amount"
            className="border-1 peer relative block min-h-[auto] w-32 rounded bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlInput1"
            placeholder="Amount"
          />
        )}

        {paPlayer[production.buildingFieldName] >= 2 && "Producing ..."}
        {paPlayer[production.buildingFieldName] === 1 && "Done"}
      </td>
      <td
        data-th="Cost"
        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
      >
        {production.buildingCost}
      </td>
    </tr>
  );
};

const ProductionTable: FC<ConstructProps> = ({ paPlayer }) => {
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
        {PRODUCTION.map((production) => (
          <ProductionRow
            key={production.buildingId}
            paPlayer={paPlayer}
            production={production}
          />
        ))}
      </tbody>
    </table>
  );
};

const Production: FC<ConstructProps> = ({ paPlayer }) => (
  <ProductionTable paPlayer={paPlayer} />
);

export default Production;
