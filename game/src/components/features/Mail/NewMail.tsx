import { useState } from "react";

import { api } from "@/utils/api";

import type { FC, ChangeEvent } from "react";
import type { PaUsers } from "@prisma/client";

import { Button, ToastComponent } from "@/components/ui";

export interface PaPlayer extends PaUsers {
  [key: string]: number | string | null;
}

interface IMilitaryProps {
  paPlayer: PaPlayer;
}

interface IHandleInputChange {
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

const NewMail: FC<IMilitaryProps> = ({ paPlayer }) => {
  const ctx = api.useContext();
  const [mailTarget, setMailTarget] = useState("");
  const [mailContent, setMailContent] = useState("");
  const [mailHeader, setMailHeader] = useState("");

  const { mutate: sendMail, isLoading } = api.paMail.sendMail.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Mail sent!", type: "success" });
      await ctx.paMail.getAllMailByNick.invalidate();
      await ctx.paMail.getAllMailByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Error ...", type: "error" });
    },
  });

  const handleInputMailTargetChange: IHandleInputChange = (event) => {
    setMailTarget(event.target.value);
  };

  const handleInputMailContentChange: IHandleInputChange = (event) => {
    setMailContent(event.target.value);
  };

  const handleInputMailHeaderChange: IHandleInputChange = (event) => {
    setMailHeader(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-full">
        <div className="mb-4 rounded-lg bg-white px-8 py-5 shadow-md">
          <h2 className="py-4 text-center text-xl font-bold">Mail</h2>
          <div className="flex flex-col items-center justify-center">
            <span className="text-md py-4">Nick:</span>
            <input
              type="text"
              name="attack"
              onChange={handleInputMailTargetChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
              required
            />
            <span className="text-md py-4">Title:</span>
            <input
              type="text"
              name="attack"
              onChange={handleInputMailHeaderChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
              required
            />

            <span className="text-md py-4">Content:</span>
            <textarea
              name="attack"
              onChange={handleInputMailContentChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
              required
            />
            <Button
              disabled={isLoading}
              onClick={(event) => {
                event.preventDefault();

                console.log("mailTarget", mailTarget);

                sendMail({
                  nick: mailTarget,
                  news: mailContent,
                  header: mailHeader,
                });
              }}
              extraClasses="w-32 mt-4"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMail;
