import { useRef } from "react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/common";

import type { PaUsers, PaTag } from "@prisma/client";
import type { FC } from "react";

import { api } from "@/utils/api";
import ToastComponent from "@/components/ui/common/ToastComponent";

interface IAllianceProps {
  paPlayer: PaUsers;
  paTag: PaTag[];
}

/**
 * Renders a form for creating, joining, and leaving an alliance.
 * @param {Object} props - The component props.
 * @param {PaUsers} props.paPlayer - The player object.
 * @param {PaTag[]} props.paTag - The array of tags.
 * @returns {JSX.Element} - The rendered component.
 */
const Alliance: FC<IAllianceProps> = ({ paPlayer, paTag }) => {
  const ctx = api.useContext();
  const { user } = useUser();
  const createAllianceRef = useRef<HTMLInputElement>(null);
  const joinAllianceRef = useRef<HTMLInputElement>(null);

  const isLeader =
    paTag.find((tag: PaTag) => tag.leader === paPlayer.nick) !== undefined;

  const player = paPlayer.nick;
  const allianceTag = paTag.find((tag) => tag.leader === player);
  const alliancePassword = allianceTag ? allianceTag.password : null;

  const { mutate: createAlliance, isLoading: isCreateAllianceLoading } =
    api.paTag.createAlliance.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "Alliance created", type: "success" });
        await ctx.paUsers.getPlayerByNick.invalidate();
        await ctx.paUsers.getPlayerByNick.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Database error", type: "error" });
      },
    });
  const { mutate: joinAlliance, isLoading: isJoinAllianceLoading } =
    api.paTag.joinAlliance.useMutation({
      onSuccess: async (result: string) => {
        if (result === "Wrong password") {
          ToastComponent({ message: result, type: "error" });
          return;
        }
        ToastComponent({ message: "Alliance joined", type: "success" });
        await ctx.paUsers.getPlayerByNick.invalidate();
        await ctx.paUsers.getPlayerByNick.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Database error", type: "error" });
      },
    });

  const { mutate: leaveAlliance } = api.paTag.leaveAlliance.useMutation({
    onSuccess: async () => {
      ToastComponent({ message: "Alliance left", type: "success" });
      await ctx.paUsers.getPlayerByNick.invalidate();
      await ctx.paUsers.getPlayerByNick.refetch();
    },
    onError: () => {
      ToastComponent({ message: "Database error", type: "error" });
    },
  });

  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
      <div className="relative py-4 sm:mx-auto">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-[20.625rem] items-center justify-center rounded bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:w-[44.563rem]">
              <form>
                <h2 className="mb-4 text-center text-2xl font-bold text-black">
                  Alliance{" "}
                  {paPlayer.tag && (
                    <>
                      - {isLeader ? "leader" : "member"} of {paPlayer.tag}
                    </>
                  )}
                </h2>
                {isLeader && paPlayer.tag && (
                  <div className="relative mt-2 w-64">
                    <h2 className="mb-4 text-center text-2xl font-bold text-black">
                      Password: {alliancePassword}
                    </h2>
                  </div>
                )}
                {!paPlayer.tag && (
                  <>
                    <div className="relative mt-2 w-64">
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
                        className="mb-2 block py-2 text-sm font-bold text-gray-500"
                      >
                        Create alliance
                      </label>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button
                        extraClasses="mb-4"
                        disabled={isCreateAllianceLoading}
                        onClick={(event) => {
                          event.preventDefault();
                          if (!createAllianceRef?.current?.value) {
                            ToastComponent({
                              message: "You need to type something",
                              type: "error",
                            });
                            return;
                          }
                          createAlliance({
                            Userid: paPlayer.id,
                            tagName: createAllianceRef.current.value,
                          });
                        }}
                      >
                        Create
                      </Button>
                    </div>
                  </>
                )}
                {paPlayer.tag && (
                  <div className="flex items-center justify-center">
                    <Button
                      extraClasses="mb-4"
                      onClick={(event) => {
                        event.preventDefault();
                        leaveAlliance({
                          Userid: paPlayer.id,
                        });
                      }}
                    >
                      Leave
                    </Button>
                  </div>
                )}
                <div className="relative mt-2 w-64">
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
                    className="mb-2 block py-2 text-sm font-bold text-gray-500"
                  >
                    Join alliance
                  </label>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    extraClasses="mb-4"
                    disabled={isJoinAllianceLoading}
                    onClick={(event) => {
                      event.preventDefault();
                      if (!joinAllianceRef?.current?.value) {
                        ToastComponent({
                          message: "You need to type something",
                          type: "error",
                        });
                        return;
                      }
                      joinAlliance({
                        Userid: paPlayer.id,
                        tagPassword: joinAllianceRef.current.value,
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
