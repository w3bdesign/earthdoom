import { FC, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import { api } from "@/utils/api";

import type { PaUsers } from "@prisma/client";

import Button from "@/components/ui/common/Button";

export interface PaPlayer extends PaUsers {
  [key: string]: number | string;
}

interface IMilitaryProps {
  paPlayer: PaPlayer;
}

const Military: FC<IMilitaryProps> = ({ paPlayer }) => {
  const ctx = api.useContext();
  const { user } = useUser();

  const [attackValue, setAttackValue] = useState<string>("");
  const [defValue, setDefValue] = useState<string>("");

  const militaryToast = () => toast("Troops are on their way");
  const errorToast = () => toast("Database error");

  const areTroopsAvailable =
    Number(paPlayer.war) === 0 && Number(paPlayer.def) === 0;

  const { mutate, isLoading } = api.paUsers.militaryAction.useMutation({
    onSuccess: async () => {
      militaryToast();
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      errorToast();
    },
  });

  function handleInputAttackChange(event: {
    target: { value: SetStateAction<string> };
  }) {
    setAttackValue(event.target.value);
  }

  function handleInputDefChange(event: {
    target: { value: SetStateAction<string> };
  }) {
    setDefValue(event.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-lg">
        <div className="mb-4 rounded-lg bg-white px-8 py-6 shadow-md">
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
              disabled={
                isLoading || !areTroopsAvailable || attackValue.length === 0
              }
              onClick={(event) => {
                event.preventDefault();
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
              disabled={
                isLoading || !areTroopsAvailable || defValue.length === 0
              }
              extraClasses="w-32 mt-4"
              onClick={(event) => {
                event.preventDefault();
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
