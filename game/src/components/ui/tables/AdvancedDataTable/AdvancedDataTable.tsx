import { Stringifier, canAffordToTrain } from "@/utils/functions";

import type { FC, RefObject } from "react";
import type { PaPlayer, PaPlayerBase } from "@/types/player";
import type { Building } from "@/components/features/Construct/types/types";
import type { UseMutateFunction } from "@tanstack/react-query";

import ActionButton from "./ActionButton";
import InputNumber from "./InputNumber";
import { useMultipleRefs } from "@/utils/hooks";

type MutationData = unknown;

// Server-side Zod schemas enforce valid field names via z.enum() whitelists.
// This type is intentionally permissive so the shared UI component can work
// with different mutation signatures (research, construct, production, spying).
type MutationVariables = Record<string, unknown>;

export type TMutateType = UseMutateFunction<
  MutationData,
  unknown,
  MutationVariables,
  unknown
>;

export interface AdvancedTableColumn {
  label: string;
  accessor:
    | string
    | JSX.Element
    | ((row: PaPlayerBase | Building) => JSX.Element);
  type?: string;
}

export interface AdvancedDataTableProps {
  isLoading?: boolean;
  columns: AdvancedTableColumn[];
  data: PaPlayerBase[];
  caption: string;
  renderData?: Building[];
  action?: TMutateType;
  actionText?: string;
  actionInProgress?: string;
  considerLand?: boolean;
}

/** Renders the accessor content for a table cell */
const CellAccessorContent: FC<{
  col: AdvancedTableColumn;
  row: PaPlayerBase | Building;
}> = ({ col, row }) => {
  if (typeof col.accessor === "function") {
    return <>{col.accessor(row)}</>;
  }
  if (typeof col.accessor === "string" && col.accessor !== "") {
    return <Stringifier value={row[col.accessor]} />;
  }
  if (col.type !== "button") {
    return <>{col.accessor}</>;
  }
  return null;
};

/** Renders the input number field when applicable */
const CellInputNumber: FC<{
  col: AdvancedTableColumn;
  inputRef: RefObject<HTMLInputElement> | undefined;
}> = ({ col, inputRef }) => {
  if (col.type !== "inputNumber" || !canAffordToTrain) return null;
  return <InputNumber canAffordToTrain={canAffordToTrain} ref={inputRef} />;
};

/** Renders the action button when applicable */
const CellActionButton: FC<{
  col: AdvancedTableColumn;
  row: PaPlayerBase | Building;
  isLoading: boolean;
  data: PaPlayerBase[];
  action?: TMutateType;
  actionText?: string;
  actionInProgress?: string;
  inputRef: RefObject<HTMLInputElement> | undefined;
  considerLand: boolean;
}> = ({
  col,
  row,
  isLoading,
  data,
  action,
  actionText,
  actionInProgress,
  inputRef,
  considerLand,
}) => {
  if (col.type !== "button" || !action || !actionText || !data) return null;

  return (
    <ActionButton
      isLoading={isLoading}
      paPlayer={data}
      building={row.buildingId ? (row as Building) : undefined}
      mutate={action}
      actionText={actionText}
      actionInProgress={actionInProgress}
      inputAmountRef={inputRef}
      considerLand={considerLand}
    />
  );
};

/**
 * Renders an advanced data table component.
 *
 * @param {AdvancedDataTableProps} props - The component props.
 * @param {boolean} props.isLoading - Indicates if the data is currently loading.
 * @param {Array<AdvancedTableColumn>} props.columns - The columns to be displayed in the table.
 * @param {Array<PaPlayer>} props.data - The data to be rendered in the table.
 * @param {string} props.caption - The caption of the table.
 * @param {Array<Building>} props.renderData - The data to be rendered in the table, optionally overridden by the renderData prop.
 * @param {TMutateType} props.action - The action to be performed on the data.
 * @param {string} props.actionText - The text for the action button.
 * @param {string} props.actionInProgress - The text to be displayed while the action is in progress.
 * @param {boolean} props.considerLand - Indicates if land should be considered.
 * @return {JSX.Element} The rendered advanced data table.
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
  considerLand = false,
}: AdvancedDataTableProps): JSX.Element => {
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
                  className="flex h-[7rem] items-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell sm:border-l sm:border-t sm:before:content-none md:h-12 md:px-6 md:text-left"
                >
                  <CellAccessorContent col={col} row={row} />
                  <CellInputNumber
                    col={col}
                    inputRef={inputAmountRefs[rowIndex]}
                  />
                  <CellActionButton
                    col={col}
                    row={row}
                    isLoading={isLoading}
                    data={data}
                    action={action}
                    actionText={actionText}
                    actionInProgress={actionInProgress}
                    inputRef={inputAmountRefs[rowIndex]}
                    considerLand={considerLand}
                  />
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AdvancedDataTable;
