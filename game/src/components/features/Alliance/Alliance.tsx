import { useRef } from "react";

import { Button } from "@/components/ui";
import Field, { INPUT_CLASS } from "@/components/ui/Field";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";

import type { PaUsers, PaTag } from "@prisma/client";
import type { FC } from "react";

import { api } from "@/utils/api";
import ToastComponent from "@/components/ui/notifications/ToastComponent";
import showConfirmationToast from "@/components/ui/notifications/ConfirmationToast";

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
    showConfirmationToast({
      message: "Are you sure you want to leave your alliance?",
      onConfirm: () => leaveAlliance({ Userid: paPlayer.id }),
      confirmText: "Leave",
      cancelText: "Cancel",
    });
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
    <form
      className="flex flex-col gap-4 [&>div:first-child]:mb-2"
      onSubmit={(event) => event.preventDefault()}
    >
      <AllianceHeader
        paPlayer={paPlayer}
        isLeader={isLeader}
        alliancePassword={alliancePassword}
      />
      {paPlayer.tag && (
        <Panel title="Membership">
          <p className="text-sm text-muted">
            Leave {paPlayer.tag} to create or join another alliance.
          </p>
          <Button
            variant="danger"
            extraClasses="mt-3"
            disabled={isAnyMutationLoading}
            onClick={handleLeave}
          >
            Leave alliance
          </Button>
        </Panel>
      )}
      {!paPlayer.tag && (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="Create alliance">
            <AllianceInput
              label="Alliance tag"
              id="alliance-create-alliance"
              hint="Letters only. You become the leader and get a password to share."
              inputRef={createAllianceRef}
              buttonText="Create"
              disabled={isAnyMutationLoading}
              onClick={handleCreate}
            />
          </Panel>
          <Panel title="Join alliance">
            <AllianceInput
              label="Alliance password"
              id="alliance-join-alliance"
              hint="Ask the alliance leader for the password."
              inputRef={joinAllianceRef}
              buttonText="Join"
              disabled={isAnyMutationLoading}
              onClick={handleJoin}
            />
          </Panel>
        </div>
      )}
    </form>
  );
};

/** Displays the alliance header with role and password info */
const AllianceHeader: FC<{
  paPlayer: PaUsers;
  isLeader: boolean;
  alliancePassword: string | null;
}> = ({ paPlayer, isLeader, alliancePassword }) => (
  <>
    <PageHeader
      title="Alliance"
      description={
        paPlayer.tag
          ? `You are ${isLeader ? "the leader" : "a member"} of ${paPlayer.tag}.`
          : "You are not in an alliance. Create one or join with a password."
      }
    />
    {isLeader && paPlayer.tag && (
      <Panel title="Password">
        <p className="break-all font-mono text-sm text-ink">
          {alliancePassword}
        </p>
        <p className="mt-2 text-xs text-muted">
          Share it with players you want in {paPlayer.tag}.
        </p>
      </Panel>
    )}
  </>
);
/** Reusable alliance input field with label and action button */
const AllianceInput: FC<{
  label: string;
  id: string;
  hint: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  buttonText: string;
  disabled: boolean;
  onClick: (event: { preventDefault: () => void }) => void;
}> = ({ label, id, hint, inputRef, buttonText, disabled, onClick }) => (
  <div className="flex flex-col gap-3">
    <Field label={label} htmlFor={id} hint={hint}>
      <input
        type="text"
        className={INPUT_CLASS}
        id={id}
        pattern="[A-Za-z]+"
        title="Please enter letters only"
        ref={inputRef}
      />
    </Field>
    <div>
      <Button disabled={disabled} onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  </div>
);

export default Alliance;
