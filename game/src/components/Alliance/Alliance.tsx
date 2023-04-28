import toast from "react-hot-toast";
import { useRef } from "react";
import { useUser } from "@clerk/nextjs";

import type { PaUsers } from "@prisma/client";
import type { FC } from "react";

import { api } from "@/utils/api";

import Button from "../common/Button";

interface IAllianceProps {
  paPlayer: PaUsers;
}

const Alliance: FC<IAllianceProps> = ({ paPlayer }) => {
  const ctx = api.useContext();
  const { user, isLoaded } = useUser();
  const createAllianceRef = useRef<HTMLInputElement>(null);
  const joinAllianceRef = useRef<HTMLInputElement>(null);

  const allianceCreatedToast = () => toast("Alliance created");
  const allianceJoinedToast = () => toast("Alliance joined");
  const errorToast = () => toast("Database error");

  const { mutate, isLoading } = api.paUsers.constructBuilding.useMutation({
    onSuccess: async () => {
      allianceCreatedToast();
      if (user && user.username) {
        await ctx.paUsers.getPlayerById.invalidate({ nick: user.username });
      }
    },
    onError: () => {
      errorToast();
    },
  });

  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
      <div className="relative py-4 sm:mx-auto">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 lg:w-[500px]">
              <form>
                <h2 className="mb-4 text-center text-2xl font-bold text-black">
                  Alliance
                </h2>
                <div className="relative mb-4 w-64">
                  <input
                    type="text"
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    pattern="[A-Za-z]+"
                    title="Please enter letters only"
                    ref={createAllianceRef}
                  />
                  <label
                    htmlFor="exampleInputEmail1"
                    className="mb-2 py-2 block text-sm font-bold text-gray-500"
                  >
                    Create alliance
                  </label>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    onClick={() => {
                      mutate({
                        Userid: paPlayer.id,
                        allianceCreate: joinAllianceRef?.current?.value,
                      });
                    }}
                  >
                    Create
                  </Button>
                </div>
                <div className="relative mb-4 w-64">
                  <input
                    type="text"
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    pattern="[A-Za-z]+"
                    title="Please enter letters only"
                    ref={joinAllianceRef}
                  />
                  <label
                    htmlFor="exampleInputEmail1"
                    className="py-2 mb-2 block text-sm font-bold text-gray-500"
                  >
                    Join alliance
                  </label>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    onClick={() => {
                      mutate({
                        Userid: paPlayer.id,
                        allianceCreate: joinAllianceRef?.current?.value,
                      });
                    }}
                  >
                    Join
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alliance;
