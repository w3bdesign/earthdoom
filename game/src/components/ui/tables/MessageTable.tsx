import type { FC } from "react";

import { format } from "date-fns";
import { LuTrash2 } from "react-icons/lu";

import Badge from "@/components/ui/Badge";

/** A single row item that both Mail and News tables share */
interface MessageRow {
  id: number;
  time: number;
  header: string;
  news: string;
  /** Mail only: 0 while unread */
  seen?: number | string;
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
 * Shared list for time-stamped messages (mail, news) with a delete action per item.
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
    <ul className="divide-y divide-line">
      {filteredItems.map((item) => {
        const date = new Date(item.time * 1000);
        const unread = item.seen === 0;
        return (
          <li
            key={item.id}
            className={`flex gap-3 px-4 py-3 ${unread ? "bg-accent/6" : ""}`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-sm font-semibold text-ink font-stretch-100%">
                  {item.header}
                </h3>
                {unread && <Badge tone="accent">New</Badge>}
                <time
                  dateTime={date.toISOString()}
                  title={timeColumnLabel}
                  className="text-xs text-muted"
                >
                  {format(date, "dd/MM-yyyy HH:mm:ss")}
                </time>
              </div>
              <p className="mt-1 text-sm wrap-break-word whitespace-pre-line text-ink/80">
                {item.news}
              </p>
            </div>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(item.id)}
              aria-label={`Delete "${item.header}"`}
              title="Delete"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-hostile/10 hover:text-hostile disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuTrash2 aria-hidden className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default MessageTable;
