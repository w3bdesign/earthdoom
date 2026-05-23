import type { FC } from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui";

const TH_CLASS =
  "hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell";

const TD_CLASS =
  "flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none";

const TD_ACTION_CLASS =
  "flex h-12 items-center px-6 py-2 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':']  first:border-l-0 sm:table-cell sm:border-l sm:border-t sm:before:content-none";

/** A single row item that both Mail and News tables share */
export interface MessageRow {
  id: number;
  time: number;
  header: string;
  news: string;
}

interface MessageTableProps {
  items: MessageRow[];
  timeColumnLabel?: string;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  /** Optional filter predicate to exclude certain rows */
  filterRow?: (item: MessageRow) => boolean;
}

/**
 * Shared table component for displaying time-stamped messages (mail, news)
 * with a delete action per row.
 */
const MessageTable: FC<MessageTableProps> = ({
  items,
  timeColumnLabel = "Time",
  isDeleting,
  onDelete,
  filterRow,
}) => {
  const filteredItems = filterRow ? items.filter(filterRow) : items;

  if (filteredItems.length === 0) return null;

  return (
    <table className="min-w-full text-left text-sm font-light">
      <thead className="border-b font-medium dark:border-neutral-500">
        <tr>
          <th scope="col" className={TH_CLASS}>
            {timeColumnLabel}
          </th>
          <th scope="col" className={TH_CLASS}>
            Title
          </th>
          <th scope="col" className={TH_CLASS}>
            Content
          </th>
          <th scope="col" className={TH_CLASS}>
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredItems.map((item) => (
          <tr key={item.id} className="border-b dark:border-neutral-500">
            <td className={TD_CLASS}>
              {format(new Date(item.time * 1000), "dd/MM-yyyy HH:mm:ss")}
            </td>
            <td className={TD_CLASS}>{item.header}</td>
            <td className={TD_CLASS}>{item.news}</td>
            <td className={TD_ACTION_CLASS}>
              <Button
                disabled={isDeleting}
                variant="danger"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MessageTable;
