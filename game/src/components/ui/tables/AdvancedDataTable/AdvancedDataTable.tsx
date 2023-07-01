import { Stringifier, canAffordToTrain } from "@/utils/functions";

import type { FC } from "react";
import type { PaPlayer } from "@/components/features/Military/Military";
import type { Building } from "@/components/features/Construct/types/types";
import type { UseMutateFunction } from "@tanstack/react-query";

import ActionButton from "./ActionButton";
import InputNumber from "./InputNumber";
import { useMultipleRefs } from "@/utils/hooks";

type MutationData = unknown;

export type TMutateType = UseMutateFunction<
  MutationData,
  unknown,
  {
    Userid: number;
    buildingFieldName: string;
    buildingNeedsFieldName?: number;
    buildingETA: number;
    buildingFieldNameETA?: number | string;
    buildingCostCrystal: number;
    buildingCostTitanium: number;
    unitAmount?: number;
  },
  unknown
>;

export interface AdvancedTableColumn {
  label: string;
  accessor: string | JSX.Element;
  type?: string;
}

export interface AdvancedDataTableProps {
  isLoading?: boolean;
  columns: AdvancedTableColumn[];
  data: PaPlayer[];
  caption: string;
  renderData?: Building[];
  action?: TMutateType;
  actionText?: string;
  actionInProgress?: string;
}

/**
 * Reusable AdvancedDataTable component for displaying data in a table
 * @param {object} props - The props for the DataTable component
 * @param {boolean} props.isLoading - Is the mutation loading?
 * @param {Array<object>} props.columns - An array of objects representing the columns of the table
 * @param {Array<object>} props.data - An array of objects representing the data to be displayed in the table
 * @param {string} props.caption - The caption of the table
 * @param {Array<object>} [props.renderData] - An optional array of objects representing additional data to be rendered in the table
 * @param {string} [props.action] - An optional string representing an action to be performed on the data
 * @param {string} [props.actionText] - An optional string representing the text for the action button
 * @param {string} [props.actionInProgress] - An optional string representing the text to be displayed while the action is in progress
 * @returns {JSX.Element} - The DataTable component
 */
const AdvancedDataTable: FC<AdvancedDataTableProps> = ({
  isLoading = false,
  columns,
  data,
  caption,
  renderData,
  action,
  actionText,
  actionInProgress,
}) => {
  const dataToMap = renderData || data;

  const inputAmountRefs = useMultipleRefs(columns.length);

  return (
    <table className="mb-8 mt-4 block pl-2 text-left md:pl-0">
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
        {dataToMap &&
          dataToMap.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="block border-b bg-white p-4 last:border-b-0 sm:table-row sm:border-none md:p-0"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  data-th={col.label}
                  className="flex h-[7rem] items-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell sm:border-l sm:border-t  sm:before:content-none md:h-12 md:px-6 md:text-left"
                >
                  {typeof col.accessor === "string" && (
                    <Stringifier value={row[col.accessor]} />
                  )}
                  {col.type === "inputNumber" && canAffordToTrain ? (
                    <InputNumber
                      canAffordToTrain={canAffordToTrain}
                      ref={inputAmountRefs[rowIndex]}
                    />
                  ) : null}
                  {col.type === "button" && action && actionText ? (
                    <ActionButton
                      isLoading={isLoading}
                      paPlayer={data}
                      canAffordToTrain={canAffordToTrain}
                      mutate={action}
                      actionText={actionText}
                      actionInProgress={actionInProgress}
                      inputAmountRef={inputAmountRefs[rowIndex]}
                    />
                  ) : null}
                  {typeof col.accessor !== "string" &&
                  actionText &&
                  action &&
                  row.buildingId ? (
                    <ActionButton
                      isLoading={isLoading}
                      paPlayer={data}
                      building={row as Building}
                      canAffordToTrain={canAffordToTrain}
                      mutate={action}
                      actionText={actionText}
                      actionInProgress={actionInProgress}
                      inputAmountRef={inputAmountRefs[rowIndex]}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AdvancedDataTable;
