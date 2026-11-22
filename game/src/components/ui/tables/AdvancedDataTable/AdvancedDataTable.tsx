import {
  Stringifier,
  formatNumber,
  maximumAffordable,
} from "@/utils/functions";

import type { FC, RefObject, ReactElement } from "react";
import type { PaPlayerBase } from "@/types/player";
import type { Building } from "@/components/features/Construct/types/types";

import Cost from "../../Cost";
import ActionButton from "./ActionButton";
import InputNumber from "./InputNumber";
import { useMultipleRefs } from "@/utils/hooks";

/** Base shape shared by all mutations that AdvancedDataTable can trigger */
export interface BaseMutationVariables {
  buildingFieldName: string;
  buildingETA: number;
  buildingCostCrystal: number;
  buildingCostTitanium: number;
  unitAmount?: number;
  buildingFieldNameETA?: string;
  spyingType?: string;
}

/**
 * A callable type for mutation functions passed to AdvancedDataTable.
 * Each page's strongly-typed mutate function narrows buildingFieldName
 * to specific string literals via Zod schemas; this shared component
 * only constructs calls using the base shape. We use a callable interface
 * to express "accepts at least BaseMutationVariables" without contravariance issues.
 */
export interface TMutateType {
  (variables: BaseMutationVariables): void;
}

export interface AdvancedTableColumn {
  label: string;
  accessor:
    | string
    | ReactElement
    | ((row: PaPlayerBase | Building) => ReactElement);
  type?: string;
  /** Right-align the column on wide screens (numbers) */
  align?: "left" | "right";
  /** The main column (default: the first). On narrow screens it also shows the ETA and description */
  primary?: boolean;
  /** Hide the column below 768px */
  hideOnMobile?: boolean;
}

interface AdvancedDataTableProps {
  isLoading?: boolean;
  columns: AdvancedTableColumn[];
  data: PaPlayerBase[];
  caption: string;
  renderData?: Building[];
  action?: TMutateType;
  actionText?: string;
  actionInProgress?: string;
  considerLand?: boolean;
  /** Rows to emphasise, such as the current player in the ranking */
  highlightRow?: (row: PaPlayerBase | Building) => boolean;
}

const isBuilding = (row: PaPlayerBase | Building): row is Building =>
  typeof row.buildingCostCrystal === "number";

/** Renders the accessor content for a table cell */
const CellAccessorContent: FC<{
  col: AdvancedTableColumn;
  row: PaPlayerBase | Building;
  player?: PaPlayerBase;
}> = ({ col, row, player }) => {
  if (typeof col.accessor === "function") {
    return <>{col.accessor(row)}</>;
  }
  if (col.accessor === "buildingCost" && isBuilding(row)) {
    return (
      <Cost
        crystal={row.buildingCostCrystal}
        titanium={row.buildingCostTitanium}
        player={player}
      />
    );
  }
  if (col.accessor === "buildingETA" && typeof row.buildingETA === "number") {
    return (
      <span className="whitespace-nowrap">
        {formatNumber(row.buildingETA)} ticks
      </span>
    );
  }
  if (col.type === "inputNumber") {
    return null;
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
  row: PaPlayerBase | Building;
  player?: PaPlayerBase;
  rowKey: string;
  inputRef: RefObject<HTMLInputElement | null> | undefined;
  considerLand: boolean;
}> = ({ col, row, player, rowKey, inputRef, considerLand }) => {
  if (col.type !== "inputNumber") return null;
  const max =
    player && isBuilding(row)
      ? maximumAffordable(
          player,
          row.buildingCostCrystal,
          row.buildingCostTitanium,
          considerLand,
        )
      : null;
  return (
    <InputNumber
      ref={inputRef}
      id={`amount-${rowKey}`}
      label={`Amount of ${String(row.buildingName ?? col.label)}`}
      max={max}
    />
  );
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
  inputRef: RefObject<HTMLInputElement | null> | undefined;
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

/** Which columns are visible at which width. Hidden ETA and description move under the name. */
const visibility = (col: AdvancedTableColumn): string => {
  if (col.accessor === "buildingDescription") return "hidden lg:table-cell";
  if (col.accessor === "buildingETA" || col.hideOnMobile)
    return "hidden md:table-cell";
  if (col.accessor === "buildingCost") return "hidden sm:table-cell";
  return "";
};

/** The ETA and description shown under the name where their own columns are hidden */
const PrimaryExtras: FC<{
  row: PaPlayerBase | Building;
  columns: AdvancedTableColumn[];
  player?: PaPlayerBase;
}> = ({ row, columns, player }) => {
  const hasCost = columns.some((col) => col.accessor === "buildingCost");
  const hasEta = columns.some((col) => col.accessor === "buildingETA");
  const hasDescription = columns.some(
    (col) => col.accessor === "buildingDescription",
  );
  return (
    <>
      {hasEta && typeof row.buildingETA === "number" && (
        <span className="block text-xs font-normal text-muted md:hidden">
          {formatNumber(row.buildingETA)} ticks
        </span>
      )}
      {hasCost && isBuilding(row) && (
        <span className="mt-1 block text-xs font-normal sm:hidden">
          <Cost
            crystal={row.buildingCostCrystal}
            titanium={row.buildingCostTitanium}
            player={player}
          />
        </span>
      )}
      {hasDescription && typeof row.buildingDescription === "string" && (
        <span className="mt-1 line-clamp-2 text-xs font-normal text-muted lg:hidden">
          {row.buildingDescription}
        </span>
      )}
    </>
  );
};

/**
 * Renders a table of buildings, units or players with optional quantity inputs and actions.
 * On narrow screens the ETA and description columns move under the name.
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
  highlightRow,
}: AdvancedDataTableProps): ReactElement => {
  const dataToMap = renderData || data;
  const player = renderData ? data[0] : undefined;

  // One ref per row: each row has its own quantity input
  const inputAmountRefs = useMultipleRefs(dataToMap?.length ?? 0);

  const markedPrimary = columns.findIndex((col) => col.primary);
  const primaryIndex = markedPrimary === -1 ? 0 : markedPrimary;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel shadow-panel">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-raised">
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`h-10 px-3 text-xs font-medium text-muted lg:px-4 ${visibility(col)} ${
                  col.align === "right" ? "text-right" : ""
                } ${col.type === "button" ? "lg:w-40" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {dataToMap &&
            dataToMap.map((row, rowIndex) => {
              const highlighted = highlightRow?.(row) ?? false;
              const rowKey = String(row.buildingId ?? row.id ?? rowIndex);
              return (
                <tr
                  key={rowKey}
                  aria-current={highlighted ? "true" : undefined}
                  className={highlighted ? "bg-accent/10" : "hover:bg-white/2"}
                >
                  {columns.map((col, colIndex) => {
                    const isPrimary = colIndex === primaryIndex;
                    return (
                      <td
                        key={colIndex}
                        className={`px-3 py-3 align-middle lg:px-4 ${visibility(col)} ${
                          col.align === "right" ? "text-right" : ""
                        } ${
                          isPrimary
                            ? "font-semibold text-ink"
                            : col.accessor === "buildingDescription"
                              ? "max-w-sm text-muted"
                              : "text-ink"
                        }`}
                      >
                        <CellAccessorContent
                          col={col}
                          row={row}
                          player={player}
                        />
                        {isPrimary && (
                          <PrimaryExtras row={row} columns={columns} />
                        )}
                        <CellInputNumber
                          col={col}
                          row={row}
                          player={player}
                          rowKey={rowKey}
                          inputRef={inputAmountRefs[rowIndex]}
                          considerLand={considerLand}
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
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AdvancedDataTable;
