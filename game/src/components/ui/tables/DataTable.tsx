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
 * DataTable component for displaying data in a table
 * @param {DataTableProps} props - The props for the DataTable component
 * @returns {JSX.Element} - The DataTable component
 */
export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  caption,
}) => {
  return (
    <table className="mt-4 w-[20.625rem] text-left ring-1 ring-slate-400/10 md:w-[47.125rem]">
      <caption className="py-6 text-center text-2xl font-bold text-white">
        {caption}
      </caption>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              scope="col"
              className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="block rounded bg-white p-4 shadow last:border-b-0 sm:table-row sm:border-none md:p-0"
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                data-th={column.label}
                className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
              >
                <Stringifier value={row[column.accessor]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
