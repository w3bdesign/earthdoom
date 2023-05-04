import { Stringifier, canAffordToTrain } from "@/utils/functions";

import type { PaPlayer } from "@/components/features/Production/Production";
import type { Building } from "@/components/features/Construct/types/types";
import type { UseMutateFunction } from "@tanstack/react-query";

import Button from "./Button";
import ToastComponent from "./ToastComponent";
import { FC, useRef } from "react";

type MutationData = unknown;

type TMutateType = UseMutateFunction<
  MutationData,
  unknown,
  {
    Userid: number;
    buildingFieldName: string;
    buildingNeedsFieldName?: number;
    buildingETA: number;
    buildingCostCrystal: number;
    buildingCostTitanium: number;
    unitAmount?: number;
  },
  unknown
>;

export interface TestTableColumn {
  label: string;
  accessor: string | JSX.Element;
  type?: string;
}

export interface TestDataTableProps {
  columns: TestTableColumn[];
  data: PaPlayer[];
  caption: string;
  renderData?: Building[];
  action?: TMutateType;
  actionText?: string;
  actionInProgress?: string;
}

interface IActionButtonProps {
  paPlayer: PaPlayer[];
  building?: Building;
  canAffordToTrain: typeof canAffordToTrain;
  mutate: TMutateType;
  actionText?: string;
  actionInProgress?: string;
  inputAmountRef?: React.RefObject<HTMLInputElement>;
}

interface IInputNumberProps {
  canAffordToTrain: typeof canAffordToTrain;
  inputAmountRef: React.RefObject<HTMLInputElement>;
}

const InputNumber: FC<IInputNumberProps> = ({ inputAmountRef }) => {
  return (
    <td
      data-th="Production"
      className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
    >
      <input
        type="number"
        aria-label="Amount"
        className="border-1 peer relative block min-h-[auto] w-32 rounded bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Amount"
        ref={inputAmountRef}
        defaultValue={0}
        min="0"
      />
    </td>
  );
};

const ActionButton: FC<IActionButtonProps> = ({
  paPlayer,
  building,
  canAffordToTrain,
  mutate,
  actionText,
  actionInProgress = "Constructing ...",
  inputAmountRef,
}) => {
  if (!paPlayer[0] || !building) return null;

  const shouldNotCheckFieldName =
    typeof paPlayer[0][building.buildingNeedsFieldName as string] !==
      "undefined" &&
    paPlayer[0][building.buildingNeedsFieldName as string] !== 0;

  return (
    <>
      {
        //paPlayer[0][building.buildingFieldName] === 0 &&
        // TODO Fix this
        <Button
          onClick={() => {
            if (!paPlayer[0]) return;
            if (
              !canAffordToTrain(
                paPlayer[0],
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
              Userid: paPlayer[0].id,
              buildingFieldName: building.buildingFieldName,
              buildingETA: building.buildingETA,
              buildingCostCrystal: building.buildingCostCrystal,
              buildingCostTitanium: building.buildingCostTitanium,
              unitAmount: Number(inputAmountRef?.current?.value),
            });
          }}
        >
          {actionText}
        </Button>
      }
      {paPlayer[0] &&
        building &&
        Number(paPlayer[0][building?.buildingFieldName]) >= 2 &&
        `${actionInProgress}`}
      {paPlayer[0] &&
        building &&
        paPlayer[0][building.buildingFieldName] === 1 &&
        "Done"}
    </>
  );
};

/**
 * DataTable component for displaying data in a table
 * @param {DataTableProps} props - The props for the DataTable component
 * @returns {JSX.Element} - The DataTable component
 */
export const TestDataTable: FC<TestDataTableProps> = ({
  columns,
  data,
  caption,
  renderData,
  action,
  actionText,
  actionInProgress,
}) => {
  const inputAmountRef = useRef<HTMLInputElement>(null);

  return (
    <table className="mt-4 w-[20.625rem] text-left ring-1 ring-slate-400/10 md:w-full">
      <caption className="py-6 text-center text-2xl font-bold text-white">
        {caption}
      </caption>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              scope="col"
              className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!renderData &&
          data &&
          data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  data-th={col.label}
                  className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:text-left"
                >
                  {typeof col.accessor === "string" && (
                    <Stringifier value={row[col.accessor]} />
                  )}

                  {col.type === "inputNumber" && canAffordToTrain ? (
                    <InputNumber
                      canAffordToTrain={canAffordToTrain}
                      inputAmountRef={inputAmountRef}
                    />
                  ) : null}

                  {col.type === "button" && action && actionText ? (
                    <ActionButton
                      paPlayer={data}
                      canAffordToTrain={canAffordToTrain}
                      mutate={action}
                      actionText={actionText}
                      actionInProgress={actionInProgress}
                      inputAmountRef={inputAmountRef}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          ))}

        {renderData &&
          renderData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  data-th={col.label}
                  className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:text-left"
                >
                  {!col.type && (
                    <Stringifier value={row[col.accessor as string]} />
                  )}

                  {col.type === "inputNumber" && canAffordToTrain ? (
                    <InputNumber
                      canAffordToTrain={canAffordToTrain}
                      inputAmountRef={inputAmountRef}
                    />
                  ) : null}

                  {typeof col.accessor !== "string" && action && actionText ? (
                    <>
                      <ActionButton
                        paPlayer={data}
                        building={row}
                        canAffordToTrain={canAffordToTrain}
                        mutate={action}
                        actionText={actionText}
                        actionInProgress={actionInProgress}
                        inputAmountRef={inputAmountRef}
                      />
                    </>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};
