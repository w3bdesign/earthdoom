import React from "react";

import { Button, ToastComponent } from "@/components/ui";

import type { FC } from "react";
import type { PaNews } from "@prisma/client";

import { api } from "@/utils/api";
import { format } from "date-fns";

interface INewsTableProps {
  isDeletingAll: boolean;
  news: PaNews[];
}

const NewsTable: FC<INewsTableProps> = ({ news, isDeletingAll }) => {
  const ctx = api.useContext();

  const { mutate: deleteSingleNews, isLoading: isDeleting } =
    api.paNews.deleteSingleNews.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "News deleted", type: "success" });
        await ctx.paNews.getAllNewsByUserId.invalidate();
        await ctx.paNews.getAllNewsByUserId.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Database error", type: "error" });
      },
    });

  const isOnlyCombatReport = news.every(
    ({ header }) => header === "Combat report",
  );

  if (isOnlyCombatReport)
    return (
      <h2 className="py-4 text-right text-xl font-bold">
        No general news to display
      </h2>
    );

  return (
    <>
      <table className="min-w-full text-left text-sm font-light">
        <thead className="border-b font-medium dark:border-neutral-500">
          <tr>
            <th
              scope="col"
              className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
            >
              Time
            </th>
            <th
              scope="col"
              className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
            >
              Title
            </th>
            <th
              scope="col"
              className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
            >
              Content
            </th>
            <th
              scope="col"
              className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {news?.map(
            (news) =>
              news.header !== "Combat report" && (
                <tr key={news.id} className="border-b dark:border-neutral-500">
                  <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                    {format(new Date(news.time * 1000), "dd/MM-yyyy HH:mm:ss")}
                  </td>
                  <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                    {news.header}
                  </td>
                  <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                    {news.news}
                  </td>
                  <td className="flex h-12 items-center px-6 py-2 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':']  first:border-l-0 sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                    <Button
                      disabled={isDeleting || isDeletingAll}
                      variant="danger"
                      onClick={() => {
                        deleteSingleNews({ id: news.id });
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    </>
  );
};

export default NewsTable;
