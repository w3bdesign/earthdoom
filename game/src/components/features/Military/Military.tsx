import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { api } from "@/utils/api";

import type { FC, ChangeEvent } from "react";
import type { PaUsers } from "@prisma/client";

import { Button, ToastComponent } from "@/components/ui/common";

export interface PaPlayer extends PaUsers {
  [key: string]: number | string;
}

interface IMilitaryProps {
  paPlayer: PaPlayer;
}

interface IHandleInputChange {
  (event: ChangeEvent<HTMLInputElement>): void;
}

const Military: FC<IMilitaryProps> = ({ paPlayer }) => {
  const ctx = api.useContext();
  const { user } = useUser();

  const [attackValue, setAttackValue] = useState<string>("");
  const [defValue, setDefValue] = useState<string>("");

  const areTroopsAvailable =
    Number(paPlayer.war) === 0 && Number(paPlayer.def) === 0;

  const { mutate, isLoading } = api.paUsers.militaryAction.useMutation({
    onSuccess:  () => {
      ToastComponent({ message: "Action successful!", type: "success" });
      if (user && user.username) {
        ctx.paUsers.getPlayerById.invalidate();
        ctx.paUsers.getPlayerById.refetch();
      }
    },
    onError: () => {
      ToastComponent({ message: "Error ...", type: "error" });
    },
  });

  const handleInputAttackChange: IHandleInputChange = (event) => {
    setAttackValue(event.target.value);
  };

  const handleInputDefChange: IHandleInputChange = (event) => {
    setDefValue(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <div className="w-full max-w-lg">
        <div className="mb-4 rounded-lg bg-white px-8 py-5 shadow-md">
          <h2 className="py-4 text-center text-xl font-bold">Attack:</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <span className="text-md mb-2">Country nick:</span>
            <input
              type="text"
              name="attack"
              onChange={handleInputAttackChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button
              disabled={isLoading}
              onClick={(event) => {
                event.preventDefault();
                if (!areTroopsAvailable) {
                  ToastComponent({
                    message: "Troops are not available",
                    type: "error",
                  });
                  return;
                }
                if (!attackValue.trim().length) {
                  ToastComponent({
                    message: "You need to enter a target",
                    type: "error",
                  });
                  return;
                }
                mutate({
                  Userid: paPlayer.id,
                  target: attackValue,
                  mode: "attack",
                });
              }}
              extraClasses="w-32 mt-4"
            >
              Attack
            </Button>
          </div>
          <h2 className="py-4 text-center text-xl font-bold">Defend:</h2>
          <form className="mt-4 flex flex-col items-center justify-center">
            <span className="text-md mb-2">Country nick:</span>
            <input
              type="text"
              name="defend"
              onChange={handleInputDefChange}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button
              disabled={isLoading}
              extraClasses="w-32 mt-4"
              onClick={(event) => {
                event.preventDefault();
                if (!areTroopsAvailable) {
                  ToastComponent({
                    message: "Troops are not available",
                    type: "error",
                  });
                  return;
                }
                if (!defValue.trim().length) {
                  ToastComponent({
                    message: "You need to enter a target",
                    type: "error",
                  });
                  return;
                }
                mutate({
                  Userid: paPlayer.id,
                  target: defValue,
                  mode: "defend",
                });
              }}
            >
              Defend
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Military;
