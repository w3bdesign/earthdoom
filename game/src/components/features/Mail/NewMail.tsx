import { useRef, useState } from "react";
import { api } from "@/utils/api";

import type { FC, ChangeEvent, FormEvent } from "react";
import type { PaUsers } from "@prisma/client";

import { Button, ToastComponent } from "@/components/ui";
import Field, { INPUT_CLASS } from "@/components/ui/Field";

interface PaPlayer extends PaUsers {
  [key: string]: number | string | null;
}

interface INewMailProps {
  paPlayer: PaPlayer;
  recipient: string;
}

interface IHandleInputChange {
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

/**
 * Renders a form for sending a mail.
 *
 * @param {INewMailProps} props - The component props.
 * @return {FC} The mail form component.
 */
const NewMail: FC<INewMailProps> = ({ paPlayer, recipient }) => {
  const ctx = api.useContext();
  const [mailContent, setMailContent] = useState("");
  const [mailHeader, setMailHeader] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate: sendMail, isPending: isLoading } =
    api.paMail.sendMail.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "Mail sent!", type: "success" });
        await ctx.paMail.getAllMailByNick.invalidate();
        await ctx.paMail.getAllMailByNick.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Error ...", type: "error" });
      },
    });

  const handleInputMailContentChange: IHandleInputChange = (event) => {
    setMailContent(event.target.value);
  };

  const handleInputMailHeaderChange: IHandleInputChange = (event) => {
    setMailHeader(event.target.value);
  };

  const handleMailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formRef.current?.reset();

    sendMail({
      nick: recipient,
      news: mailContent,
      header: mailHeader,
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleMailSubmit}
      className="flex max-w-2xl flex-col gap-4"
    >
      <Field label="To" htmlFor="nick">
        <input
          type="text"
          id="nick"
          value={recipient}
          readOnly
          className={INPUT_CLASS}
        />
      </Field>
      <Field label="Title" htmlFor="title">
        <input
          type="text"
          id="title"
          name="attack"
          onChange={handleInputMailHeaderChange}
          className={INPUT_CLASS}
          required
        />
      </Field>
      <Field label="Content" htmlFor="content">
        <textarea
          id="content"
          name="attack"
          rows={5}
          onChange={handleInputMailContentChange}
          className={`${INPUT_CLASS} h-auto py-2`}
          required
        />
      </Field>
      <Button
        type="submit"
        disabled={isLoading}
        extraClasses="w-full sm:w-auto sm:self-start"
      >
        Send
      </Button>
    </form>
  );
};

export default NewMail;
