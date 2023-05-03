import { Stringifier, canAffordToTrain } from "@/utils/functions";

import type { PaPlayer } from "@/components/features/Production/Production";
import type { Building } from "@/components/features/Construct/types/types";
import type { UseMutateFunction } from "@tanstack/react-query";

import Button from "./Button";
import ToastComponent from "./ToastComponent";

type TMutateType = UseMutateFunction<
  MutationData,
  unknown,
  {
    Userid: number;
    buildingFieldName: string;
    buildingETA: number;
    buildingCostCrystal: number;
    buildingCostTitanium: number;
  },
  unknown
>;

export interface TestTableColumn {
  label: string;
  accessor: string | JSX.Element;
}

export interface TestDataTableProps {
  columns: TestTableColumn[];
  data: PaPlayer[];
  caption: string;
  renderData: Building[];
  action?: TMutateType;
  actionText?: string;
}

type MutationData = unknown;

interface IActionButtonProps {
  paPlayer: PaPlayer[];
  building: Building;
  canAffordToTrain: typeof canAffordToTrain;
  mutate: TMutateType;
  actionText: string;
}

const ActionButton: React.FC<IActionButtonProps> = ({
  paPlayer,
  building,
  canAffordToTrain,
  mutate,
  actionText,
}) => {
  return (
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
        });
      }}
    >
      {actionText}
    </Button>
  );
};

/**
 * DataTable component for displaying data in a table
 * @param {DataTableProps} props - The props for the DataTable component
 * @returns {JSX.Element} - The DataTable component
 */
export const TestDataTable: React.FC<TestDataTableProps> = ({
  columns,
  data,
  caption,
  renderData,
  action,
  actionText,
}) => {
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
        {renderData.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
          >
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                data-th={col.label}
                className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
              >
                {typeof col.accessor === "string" && (
                  <Stringifier value={row[col.accessor]} />
                )}
                {action && actionText ? (
                  <>
                    <ActionButton
                      paPlayer={data}
                      building={row}
                      canAffordToTrain={canAffordToTrain}
                      mutate={action}
                      actionText={actionText}
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
