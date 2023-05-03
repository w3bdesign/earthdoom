import { Stringifier } from "@/utils/functions";

export interface TableColumn {
  label: string;
  accessor: string;
}

interface TableData {
  [key: string]: string | number;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: TableData[];
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
    <table className="mt-4 w-full text-left ring-1 ring-slate-400/10">
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
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="block border-b bg-white last:border-b-0 sm:table-row sm:border-none"
          >
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                data-th={col.label}
                className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
              >
                <Stringifier value={row[col.accessor]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
