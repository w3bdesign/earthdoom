import { useUser } from "@clerk/nextjs";
import { useRef } from "react";

import { Button, ToastComponent } from "@/components/ui";

import type { FC } from "react";
import type { IProduction } from "./types/types";
import type { PaPlayer } from "../Military/Military";

import { PRODUCTION } from "./constants/PRODUCTION";

import { api } from "@/utils/api";

import { canAffordToTrain, maximumToTrain } from "@/utils/functions";

interface BuildingRowProps {
  paPlayer: PaPlayer;
  production: IProduction;
}

export interface ConstructProps {
  paPlayer: PaPlayer;
}

const ProductionRow: FC<BuildingRowProps> = ({ paPlayer, production }) => {
  const ctx = api.useContext();
  const { isLoaded } = useUser();
  const unitAmountRef = useRef<HTMLInputElement>(null);

  const { mutate, isLoading } = api.paUsers.produceUnit.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Training started", type: "success" });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  if (paPlayer[production.buildingRequirement] === 0) {
    return null;
  }

  return (
    <tr
      key={production.buildingName}
      className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
    >
      <td
        data-th="Name"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {production.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        <span className="w-[12.5rem]">{production.buildingDescription}</span>
      </td>
      <td
        data-th="ETA"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {Number(paPlayer[production.buildingFieldName]) >= 1
          ? paPlayer[production.buildingFieldNameETA]
          : production.buildingETA}
      </td>
      <td
        data-th="Production"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {Number(paPlayer[production.buildingFieldName]) > 0 &&
          paPlayer[production.buildingFieldName]}

        {isLoading && "Starting ..."}
        {paPlayer[production.buildingFieldName] === 0 && !isLoading && (
          <input
            type="number"
            aria-label="Amount"
            className="border-1 peer relative block min-h-[auto] w-32 rounded bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlInput1"
            placeholder="Amount"
            ref={unitAmountRef}
            defaultValue={maximumToTrain(paPlayer, production)}
            min="0"
          />
        )}
      </td>
      <td
        data-th="Cost"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {production.buildingCost}
      </td>
      <td
        data-th="Build"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {isLoading && "Starting ..."}
        {paPlayer[production.buildingFieldName] === 0 && !isLoading && (
          <Button
            onClick={() => {
              if (!paPlayer || !paPlayer.id) {
                return;
              }
              if (Number(unitAmountRef?.current?.value) === 0) {
                ToastComponent({
                  message: "Needs to be more than 0",
                  type: "error",
                });
                return;
              }
              if (
                !canAffordToTrain(
                  paPlayer,
                  production.buildingCostCrystal,
                  production.buildingCostTitanium,
                  Number(unitAmountRef?.current?.value)
                )
              ) {
                ToastComponent({
                  message: "You can not afford this",
                  type: "error",
                });
                return;
              }
              mutate({
                Userid: Number(paPlayer.id),
                buildingFieldName: production.buildingFieldName,
                buildingFieldNameETA: production.buildingFieldNameETA,
                buildingCostCrystal: production.buildingCostCrystal,
                buildingCostTitanium: production.buildingCostTitanium,
                unitAmount: Number(unitAmountRef?.current?.value),
                buildingETA: production.buildingETA,
              });
            }}
          >
            Train
          </Button>
        )}
        {Number(paPlayer[production.buildingFieldName]) >= 1 &&
          `${Number(paPlayer[production.buildingFieldNameETA])} ticks left`}
      </td>
    </tr>
  );
};

const ProductionTable: FC<ConstructProps> = ({ paPlayer }) => {
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
            Amount
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
            Train
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
