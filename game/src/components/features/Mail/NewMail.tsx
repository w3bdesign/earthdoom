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
  (event: ChangeEvent<HTMLInputElement>): void;
}

const NewMail: FC<IMilitaryProps> = ({ paPlayer }) => {
  const ctx = api.useContext();
  const [mailTarget, setMailTarget] = useState("");

  const handleInputMailChange: IHandleInputChange = (event) => {
    setMailTarget(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-full">
        <div className="mb-4 rounded-lg bg-white px-8 py-5 shadow-md">
          <h2 className="py-4 text-center text-xl font-bold">Mail</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <span className="py-4 text-md">Country nick:</span>
            <input
              type="text"
              name="attack"
              onChange={handleInputMailChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <span className="py-4 text-md">Mail content:</span>
            <textarea
              name="attack"
              onChange={handleInputMailChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button
              //disabled={isLoading}
              onClick={(event) => {
                event.preventDefault();
                if (!mailTarget.trim().length) {
                  ToastComponent({
                    message: "You need to enter a target",
                    type: "error",
                  });
                  return;
                }

                /*militaryAction({
                    Userid: paPlayer.id,
                    target: attackValue,
                    energyCost: energyCost,
                    mode: "attack",
                  });*/
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
