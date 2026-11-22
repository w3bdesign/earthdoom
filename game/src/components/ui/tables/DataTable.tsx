import type { PaPlayer } from "@/components/features/Military/Military";

import { Stringifier } from "@/utils/functions";

export interface TableColumn {
  label: string;
  accessor: string;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: PaPlayer[];
  caption: string;
}

/**
 * DataTable component for displaying data in a table.
 * On narrow screens each row becomes a list of label and value pairs.
 * @param {DataTableProps} props - The props for the DataTable component
 * @returns {JSX.Element} - The DataTable component
 */
export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  caption,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel shadow-panel">
      <table className="block w-full text-left text-sm md:table">
        <caption className="block border-b border-line px-4 py-3 text-left text-base font-semibold text-ink font-stretch-112%">
          {caption}
        </caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-line bg-raised">
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="h-10 px-4 text-right text-xs font-medium text-muted"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block divide-y divide-line md:table-row-group">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="block divide-y divide-line md:table-row md:divide-y-0"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  data-th={column.label}
                  className="flex items-center justify-between px-4 py-2 text-ink tabular-nums before:text-muted before:content-[attr(data-th)] md:table-cell md:py-3 md:text-right md:before:content-none"
                >
                  <Stringifier value={row[column.accessor]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
