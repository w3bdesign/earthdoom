import { ToastComponent } from "@/components/ui";
import MessageTable from "@/components/ui/tables/MessageTable";

import type { FC } from "react";
import type { PaMail } from "@prisma/client";

import { api } from "@/utils/api";

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

  const { mutate: deleteSingleMail, isPending: isDeletingMail } =
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

  if (mail.length === 0) {
    return (
      <h1 className="text-bold p-4 text-center text-2xl text-black">
        No email to display
      </h1>
    );
  }

  return (
    <MessageTable
      items={mail}
      timeColumnLabel="Sent"
      isDeleting={isDeletingMail}
      onDelete={(id) => deleteSingleMail({ id })}
    />
  );
};

export default MailTable;
