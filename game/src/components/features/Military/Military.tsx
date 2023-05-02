import { FC, useRef } from "react";
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

  const attackRef = useRef<HTMLInputElement>(null);
  const defendRef = useRef<HTMLInputElement>(null);

  const attackToast = () => toast("Attacking player");
  const defendToast = () => toast("Defending player");
  const errorToast = () => toast("Database error");

  const { mutate, isLoading } = api.paUsers.attackPlayer.useMutation({
    onSuccess: async () => {
      attackToast();
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      errorToast();
    },
  });

  return (
    <div className="mt-6 flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-lg">
        <div className="mb-4 rounded-lg bg-white px-8 py-6 shadow-md">
          <h2 className="py-4 text-center text-xl font-bold">Attack:</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <span className="text-md mb-2">Country nick:</span>
            <input
              type="text"
              name="attack"
              ref={attackRef}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button
              onClick={() => {
                mutate({
                  Userid: paPlayer.id,
                  attackedTarget: String(attackRef.current?.value),
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
              ref={defendRef}
              className="w-64 rounded-md border border-gray-300 px-3 py-2"
            />
            <Button extraClasses="w-32 mt-4">Defend</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Military;
