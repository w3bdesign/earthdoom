import { useState } from "react";

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

  const [attackValue, setAttackValue] = useState<string>("");
  const [defValue, setDefValue] = useState<string>("");

  const areTroopsAvailable =
    Number(paPlayer.war) === 0 && Number(paPlayer.def) === 0;

  const { mutate: addNews } = api.paNews.addNews.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "News added", type: "success" });
      await ctx.paNews.getAllNewsByUserId.invalidate();
      await ctx.paNews.getAllNewsByUserId.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Error ...", type: "error" });
    },
  });

  const { data: attackedPlayer } = api.paUsers.getPlayerByNick.useQuery(
    {
      nick: attackValue,
    },
    {
      enabled: attackValue.length > 3,
    }
  );

  const { mutate, isLoading } = api.paUsers.militaryAction.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Action successful!", type: "success" });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();

      if (attackedPlayer) {
        addNews({
          sentTo: attackedPlayer.id,
          news: `${paPlayer.nick} is attacking you, ETA 30 mins`,
          header: "Incoming hostile fleet",
        });
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

  const allFleetsAtHome = paPlayer && paPlayer.war === 0 && paPlayer.def === 0;

  const shipCount =
    paPlayer["astropods"] +
    paPlayer["infinitys"] +
    paPlayer["wraiths"] +
    paPlayer["warfrigs"] +
    paPlayer["destroyers"] +
    paPlayer["scorpions"];

  const energyCost = 9 * shipCount;

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <div className="w-full max-w-lg">
        {allFleetsAtHome && shipCount > 0 ? (
          <div className="mb-4 rounded-lg bg-white px-8 py-5 shadow-md">
            <h2 className="py-4 text-center text-xl font-bold">
              Cost to attack: {energyCost} energy
              <br />
              (defending is free)
            </h2>
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
                  if (!attackValue.trim().length) {
                    ToastComponent({
                      message: "You need to enter a target",
                      type: "error",
                    });
                    return;
                  }
                  if (paPlayer.energy < energyCost) {
                    ToastComponent({
                      message: "You need more energy to attack",
                      type: "error",
                    });
                    return;
                  }
                  if (!areTroopsAvailable) {
                    ToastComponent({
                      message: "Troops are not available",
                      type: "error",
                    });
                    return;
                  }

                  mutate({
                    Userid: paPlayer.id,
                    target: attackValue,
                    energyCost: energyCost,
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
                  if (!defValue.trim().length) {
                    ToastComponent({
                      message: "You need to enter a target",
                      type: "error",
                    });
                    return;
                  }
                  if (!areTroopsAvailable) {
                    ToastComponent({
                      message: "Troops are not available",
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
        ) : null}
      </div>
    </div>
  );
};

export default Military;
