import { Button, ToastComponent } from "@/components/ui";

import type { FC } from "react";
import type { PaMail } from "@prisma/client";

import { api } from "@/utils/api";
import { format } from "date-fns";

interface IMailTableProps {
  mail: PaMail[];
}

/**
 * Renders a table of emails and allows the user to delete individual emails.
 *
 * @param {IMailTableProps} mail - the list of emails to display
 * @return {JSX.Element} - the email table component
 */
const MailTable: FC<IMailTableProps> = ({ mail }) => {
  const ctx = api.useContext();

  const { mutate: deleteSingleMail, isLoading: isDeletingMail } =
    api.paMail.deleteEmail.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "Mail deleted", type: "success" });
        await ctx.paMail.getAllMailByNick.invalidate();
        await ctx.paMail.getAllMailByNick.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Failed to delete", type: "error" });
      },
    });

  return (
    <>
      {mail && mail.length > 0 && (
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th
                scope="col"
                className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
              >
                Sent
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
            {mail.map((mail) => (
              <tr key={mail.id} className="border-b dark:border-neutral-500">
                <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                  {format(new Date(mail.time * 1000), "dd/MM-yyyy HH:mm:ss")}
                </td>
                <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                  {mail.header}
                </td>
                <td className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                  {mail.news}
                </td>

                <td className="flex h-12 items-center px-6 py-2 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':']  first:border-l-0 sm:table-cell sm:border-l sm:border-t sm:before:content-none">
                  <Button
                    disabled={isDeletingMail}
                    variant="danger"
                    onClick={() => {
                      deleteSingleMail({ id: mail.id });
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {mail.length === 0 && (
        <h1 className="text-bold p-4 text-center text-2xl text-black">
          No email to display
        </h1>
      )}
    </>
  );
};

export default MailTable;
