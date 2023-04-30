import React from "react";
import { Toaster } from "react-hot-toast";

import Button from "@/components/ui/common/Button";

import type { FC } from "react";
import type { PaNews } from "@prisma/client";

interface INewsTableProps {
  news: PaNews[];
}

const NewsTable: FC<INewsTableProps> = ({ news }) => {
  return (
    <table className="min-w-full text-left text-sm font-light">
      <thead className="border-b font-medium dark:border-neutral-500">
        <tr>
          <th scope="col" className="px-6 py-4">
            ID
          </th>
          <th scope="col" className="px-6 py-4">
            Title
          </th>
          <th scope="col" className="px-6 py-4">
            Content
          </th>
          <th scope="col" className="px-6 py-4">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {news?.map((news) => (
          <tr key={news.id} className="border-b dark:border-neutral-500">
            <td className="whitespace-nowrap px-6 py-4 font-medium">
              {news.id}
            </td>
            <td className="whitespace-nowrap px-6 py-4">{news.header}</td>
            <td className="whitespace-nowrap px-6 py-4">{news.news}</td>
            <td className="whitespace-nowrap px-6 py-4">
              <Button
                type="button"
                className="inline-block rounded bg-danger px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
                onClick={() => alert(news.id)}
              >
                Delete
              </Button>
              <Toaster />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NewsTable;
