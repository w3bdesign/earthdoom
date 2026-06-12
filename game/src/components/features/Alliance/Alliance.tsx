import { useRef } from "react";

import { Button } from "@/components/ui";

import type { PaUsers, PaTag } from "@prisma/client";
import type { FC } from "react";

import { api } from "@/utils/api";
import ToastComponent from "@/components/ui/notifications/ToastComponent";

interface IAllianceProps {
  paPlayer: PaUsers;
  paTag: PaTag[];
}

const showSuccess = (message: string) => {
  ToastComponent({ message, type: "success" });
};

const showError = (message: string) => {
  ToastComponent({ message, type: "error" });
};

const findLeaderTag = (paTag: PaTag[], nick: string): PaTag | undefined =>
  paTag.find((tag) => tag.leader === nick);

/**
 * Renders a form for creating, joining, and leaving an alliance.
 * @param {Object} props - The component props.
 * @param {PaUsers} props.paPlayer - The player object.
 * @param {PaTag[]} props.paTag - The array of tags.
 * @returns {JSX.Element} - The rendered component.
 */
const Alliance: FC<IAllianceProps> = ({ paPlayer, paTag }) => {
  const ctx = api.useContext();

  const createAllianceRef = useRef<HTMLInputElement>(null);
  const joinAllianceRef = useRef<HTMLInputElement>(null);

  const leaderTag = findLeaderTag(paTag, paPlayer.nick);
  const isLeader = leaderTag !== undefined;
  const alliancePassword = leaderTag?.password ?? null;

  const invalidateAndRefetch = async () => {
    await ctx.paTag.getAll.invalidate();
    await ctx.paTag.getAll.refetch();
    await ctx.paUsers.getPlayerByNick.invalidate();
    await ctx.paUsers.getPlayerByNick.refetch();
  };

  const { mutate: createAlliance, isPending: isCreateAllianceLoading } =
    api.paTag.createAlliance.useMutation({
      onSuccess: async () => {
        showSuccess("Alliance created");
        await invalidateAndRefetch();
      },
      onError: (error) => {
        if (error.data?.code === "CONFLICT") {
          showError("Alliance already exists");
        } else {
          showError("Database error");
        }
      },
    });

  const { mutate: joinAlliance, isPending: isJoinAllianceLoading } =
    api.paTag.joinAlliance.useMutation({
      onSuccess: async (result: string) => {
        if (result === "Wrong password") {
          showError(result);
          return;
        }
        showSuccess("Alliance joined");
        await invalidateAndRefetch();
      },
      onError: () => {
        showError("Database error");
      },
    });

  const { mutate: leaveAlliance, isPending: isLeaveAllianceLoading } =
    api.paTag.leaveAlliance.useMutation({
      onSuccess: async () => {
        showSuccess("Alliance left");
        await ctx.paUsers.getPlayerByNick.invalidate();
        await ctx.paUsers.getPlayerByNick.refetch();
      },
      onError: () => {
        showError("Database error");
      },
    });

  const isAnyMutationLoading =
    isCreateAllianceLoading || isLeaveAllianceLoading || isJoinAllianceLoading;

  const handleCreate = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const value = createAllianceRef?.current?.value;
    if (!value) {
      showError("You need to type something");
      return;
    }
    createAlliance({ Userid: paPlayer.id, tagName: value });
  };

  const handleLeave = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    leaveAlliance({ Userid: paPlayer.id });
  };

  const handleJoin = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const value = joinAllianceRef?.current?.value;
    if (!value) {
      showError("You need to type something");
      return;
    }
    joinAlliance({ Userid: paPlayer.id, tagPassword: value });
  };

  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
      <div className="relative py-4 sm:mx-auto">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-[20.625rem] items-center justify-center rounded bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:w-[44.563rem] dark:bg-neutral-700">
              <form>
                <AllianceHeader
                  paPlayer={paPlayer}
                  isLeader={isLeader}
                  alliancePassword={alliancePassword}
                />
                {!paPlayer.tag && (
                  <AllianceInput
                    label="Create alliance"
                    inputRef={createAllianceRef}
                    buttonText="Create"
                    disabled={isAnyMutationLoading}
                    onClick={handleCreate}
                  />
                )}
                {paPlayer.tag && (
                  <div className="flex items-center justify-center">
                    <Button
                      disabled={isAnyMutationLoading}
                      extraClasses="mb-4"
                      onClick={handleLeave}
                    >
                      Leave
                    </Button>
                  </div>
                )}
                <AllianceInput
                  label="Join alliance"
                  inputRef={joinAllianceRef}
                  buttonText="Join"
                  disabled={isAnyMutationLoading}
                  onClick={handleJoin}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Displays the alliance header with role and password info */
const AllianceHeader: FC<{
  paPlayer: PaUsers;
  isLeader: boolean;
  alliancePassword: string | null;
}> = ({ paPlayer, isLeader, alliancePassword }) => (
  <>
    <h2 className="mb-4 text-center text-2xl font-bold text-black">
      Alliance{" "}
      {paPlayer.tag && (
        <>
          - {isLeader ? "leader" : "member"} of {paPlayer.tag}
        </>
      )}
    </h2>
    {isLeader && paPlayer.tag && (
      <div className="relative mt-2 w-full">
        <h2 className="mb-2 text-center text-2xl font-bold text-black">
          Password:
        </h2>
        <p className="mb-4 break-all text-center text-xl text-black">
          {alliancePassword}
        </p>
      </div>
    )}
  </>
);

/** Reusable alliance input field with label and action button */
const AllianceInput: FC<{
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  buttonText: string;
  disabled: boolean;
  onClick: (event: { preventDefault: () => void }) => void;
}> = ({ label, inputRef, buttonText, disabled, onClick }) => (
  <>
    <div className="relative mt-2 w-64">
      <input
        type="text"
        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        id={`alliance-${label.toLowerCase().replace(" ", "-")}`}
        aria-describedby="emailHelp"
        pattern="[A-Za-z]+"
        title="Please enter letters only"
        ref={inputRef}
      />
      <label
        htmlFor={`alliance-${label.toLowerCase().replace(" ", "-")}`}
        className="mb-2 block py-2 text-sm font-bold text-gray-500"
      >
        {label}
      </label>
    </div>
    <div className="flex items-center justify-center">
      <Button extraClasses="mb-4" disabled={disabled} onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  </>
);

export default Alliance;
