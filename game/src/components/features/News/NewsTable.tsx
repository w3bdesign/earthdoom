import React from "react";

import { ToastComponent } from "@/components/ui";
import MessageTable from "@/components/ui/tables/MessageTable";

import type { FC } from "react";
import type { PaNews } from "@prisma/client";

import { api } from "@/utils/api";

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

  if (isOnlyCombatReport) {
    return (
      <h2 className="py-4 text-right text-xl font-bold">
        No general news to display
      </h2>
    );
  }

  return (
    <MessageTable
      items={news}
      timeColumnLabel="Time"
      isDeleting={isDeleting || isDeletingAll}
      onDelete={(id) => deleteSingleNews({ id })}
      filterRow={(item) => item.header !== "Combat report"}
    />
  );
};

export default NewsTable;
