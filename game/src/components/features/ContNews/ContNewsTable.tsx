import { Toaster } from "react-hot-toast";

import type { FC } from "react";
import type { PaNews } from "@prisma/client";

import { Button } from "@/components/ui";

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
            <td className="px-6 py-4 font-medium whitespace-nowrap">
              {news.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{news.header}</td>
            <td className="px-6 py-4 whitespace-nowrap">{news.news}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Button
                type="button"
                className="bg-danger hover:bg-danger-600 focus:bg-danger-600 active:bg-danger-700 inline-block rounded-sm px-6 pt-2.5 pb-2 text-xs leading-normal font-medium text-white uppercase shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:ring-0 focus:outline-hidden active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
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
