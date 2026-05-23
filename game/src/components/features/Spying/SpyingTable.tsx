import { useUser } from "@clerk/nextjs";
import { useRef } from "react";

import { Button, ToastComponent } from "@/components/ui";

import type { FC } from "react";
import type { Building } from "../Construct/types/types";
import type { PaPlayer } from "@/components/features/Military/Military";

import { SPYING } from "./constants/SPYING";

import { api } from "@/utils/api";
import { canAffordToTrain } from "@/utils/functions";

interface BuildingRowProps {
  paPlayer: PaPlayer;
  resource: Building;
}

interface SpyingProps {
  paPlayer: PaPlayer;
}

const showError = (message: string) => {
  ToastComponent({ message, type: "error" });
};

const validateAmount = (amount: number): boolean => {
  if (amount === 0) {
    showError("You need to enter a quantity more than 0");
    return false;
  }
  return true;
};

const validateAffordability = (
  paPlayer: PaPlayer,
  resource: Building,
  amount: number,
): boolean => {
  const canAfford = canAffordToTrain(
    [paPlayer],
    resource.buildingCostCrystal,
    resource.buildingCostTitanium,
    amount,
  );
  if (!canAfford) {
    showError("You can not afford this");
    return false;
  }
  return true;
};

const SpyingRow: FC<BuildingRowProps> = ({ paPlayer, resource }) => {
  const ctx = api.useContext();
  const { isLoaded } = useUser();
  const spyingAmountRef = useRef<HTMLInputElement>(null);

  const { mutate, isLoading } = api.paSpying.spyingInitiate.useMutation({
    onSuccess: async () => {
      ToastComponent({
        message: "Spying complete",
        type: "success",
      });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      showError("Database error");
    },
  });

  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  const numberCrystal = Number(paPlayer.crystal);
  const maximumToSearch = Math.floor(numberCrystal / 500);

  const getSpyingAmount = (): number =>
    Number(spyingAmountRef?.current?.value);

  const handleSpyClick = () => {
    if (!paPlayer?.id) return;

    const amount = getSpyingAmount();
    if (!validateAmount(amount)) return;
    if (!validateAffordability(paPlayer, resource, amount)) return;

    mutate({
      buildingFieldName:
        resource.buildingFieldName as Parameters<typeof mutate>[0]["buildingFieldName"],
      buildingCostCrystal: resource.buildingCostCrystal,
      buildingCostTitanium: resource.buildingCostTitanium,
      unitAmount: amount,
      buildingETA: 0,
    });
  };

  return (
    <tr
      key={resource.buildingName}
      className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
    >
      <td
        data-th="Name"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {resource.buildingName}
      </td>
      <td
        data-th="Info"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        <span className="w-[12.5rem]">{resource.buildingDescription}</span>
      </td>
      <td
        data-th="Production"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {isLoading && "Starting ..."}
        {!isLoading && (
          <input
            type="number"
            aria-label="Amount"
            className="border-1 peer relative block min-h-[auto] w-32 rounded bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlInput1"
            placeholder="Amount"
            ref={spyingAmountRef}
            defaultValue={maximumToSearch}
            min="0"
          />
        )}
      </td>
      <td
        data-th="Build"
        className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
      >
        {isLoading && "Starting ..."}
        {!isLoading && (
          <Button onClick={handleSpyClick}>
            Spy
          </Button>
        )}
      </td>
    </tr>
  );
};

const SpyingTable: FC<SpyingProps> = ({ paPlayer }) => {
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
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Amount
          </th>
          <th
            scope="col"
            className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
          >
            Spy
          </th>
        </tr>
        {SPYING.map((resource) => (
          <SpyingRow
            key={resource.buildingId}
            paPlayer={paPlayer}
            resource={resource}
          />
        ))}
      </tbody>
    </table>
  );
};

const Production: FC<SpyingProps> = ({ paPlayer }) => (
  <SpyingTable paPlayer={paPlayer} />
);

export default Production;
