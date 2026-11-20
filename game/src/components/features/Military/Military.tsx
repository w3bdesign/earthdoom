import { useState } from "react";
import Link from "next/link";
import { LuShield, LuSwords } from "react-icons/lu";

import { api } from "@/utils/api";
import { formatNumber, getShipCount } from "@/utils/functions";

import type { FC, FormEvent } from "react";
import type { PaPlayer } from "@/types/player";

import { Button, ToastComponent } from "@/components/ui";
import Field, { INPUT_CLASS } from "@/components/ui/Field";
import Panel from "@/components/ui/Panel";

export type { PaPlayer } from "@/types/player";

interface IMilitaryProps {
  paPlayer: PaPlayer;
}

type Mode = "attack" | "defend";

const ENERGY_PER_SHIP = 9;

/** Attack or defend, chosen with a two-option segmented control */
const ModeSwitch: FC<{ mode: Mode; onChange: (mode: Mode) => void }> = ({
  mode,
  onChange,
}) => (
  <fieldset>
    <legend className="sr-only">Mission</legend>
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-sunken p-1">
      {(
        [
          { value: "attack", label: "Attack", icon: LuSwords },
          { value: "defend", label: "Defend", icon: LuShield },
        ] as const
      ).map(({ value, label, icon: Icon }) => (
        <label
          key={value}
          className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
            mode === value
              ? value === "attack"
                ? "bg-hostile/15 text-hostile"
                : "bg-friendly/15 text-friendly"
              : "text-muted hover:text-ink"
          }`}
        >
          <input
            type="radio"
            name="mission"
            value={value}
            checked={mode === value}
            onChange={() => onChange(value)}
            className="sr-only"
          />
          <Icon aria-hidden className="h-4 w-4" />
          {label}
        </label>
      ))}
    </div>
  </fieldset>
);

const Military: FC<IMilitaryProps> = ({ paPlayer }) => {
  const ctx = api.useContext();

  const [mode, setMode] = useState<Mode>("attack");
  const [target, setTarget] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  const { data: targetedPlayer } = api.paUsers.getPlayerByNick.useQuery(
    { nick: target },
    { enabled: target.length > 3 },
  );

  const { mutate: militaryAction, isPending: isLoading } =
    api.paMilitary.militaryAction.useMutation({
      onSuccess: async (_data, variables) => {
        ToastComponent({ message: "Troops are on their way", type: "success" });
        await ctx.paUsers.getPlayerByNick.invalidate();
        await ctx.paUsers.getPlayerByNick.refetch();

        if (targetedPlayer) {
          addNews(
            variables.mode === "attack"
              ? {
                  sentTo: targetedPlayer.id,
                  news: `${paPlayer.nick} is attacking you, ETA 30 mins`,
                  header: "Incoming hostile fleet",
                }
              : {
                  sentTo: targetedPlayer.id,
                  news: `${paPlayer.nick} is defending you, ETA 25 mins`,
                  header: "Incoming defending fleet",
                },
          );
        }
      },
      onError: () => {
        ToastComponent({ message: "Error ...", type: "error" });
      },
    });

  const { mutate: retreatTroops, isPending: isRetreating } =
    api.paMilitary.retreatTroops.useMutation({
      onSuccess: async () => {
        ToastComponent({ message: "Troops are returning", type: "success" });
        await ctx.paUsers.getPlayerByNick.invalidate();
        await ctx.paUsers.getPlayerByNick.refetch();
      },
      onError: () => {
        ToastComponent({ message: "Error ...", type: "error" });
      },
    });

  const allFleetsAtHome = paPlayer.war === 0 && paPlayer.def === 0;
  const shipCount = getShipCount(paPlayer);
  const energyCost = ENERGY_PER_SHIP * shipCount;
  const canAffordAttack = paPlayer.energy >= energyCost && energyCost > 0;
  const isAttack = mode === "attack";

  if (shipCount === 0) {
    return (
      <Panel title="Send fleet">
        <p className="text-sm text-muted">
          You have no ships yet.{" "}
          <Link
            href="/production"
            className="font-semibold text-accent hover:underline"
          >
            Train units in Production
          </Link>
          .
        </p>
      </Panel>
    );
  }

  if (!allFleetsAtHome) {
    const canRetreat = paPlayer.war > 0;
    return (
      <Panel title="Fleet away">
        <p className="text-sm text-muted">
          Your fleet is out on a mission. You can send it again once it is home.
        </p>
        {canRetreat && (
          <Button
            variant="danger"
            extraClasses="mt-4 w-full sm:w-auto"
            disabled={isRetreating}
            onClick={() => retreatTroops({ Userid: paPlayer.id })}
          >
            Retreat
          </Button>
        )}
      </Panel>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nick = target.trim();
    if (!nick) {
      setError("Enter the nick of the player to " + mode);
      return;
    }
    if (isAttack && !canAffordAttack) {
      setError(
        `You need ${formatNumber(energyCost - paPlayer.energy)} more energy to attack`,
      );
      return;
    }
    setError("");
    militaryAction(
      isAttack
        ? { Userid: paPlayer.id, target: nick, energyCost, mode: "attack" }
        : { Userid: paPlayer.id, target: nick, mode: "defend" },
    );
  };

  return (
    <Panel title="Send fleet">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ModeSwitch
          mode={mode}
          onChange={(value) => {
            setMode(value);
            setError("");
          }}
        />
        <Field
          label="Target"
          htmlFor="military-target"
          hint={
            isAttack
              ? "Nick of the player to attack"
              : "Nick of the player to defend"
          }
        >
          <input
            id="military-target"
            type="text"
            name="target"
            autoComplete="off"
            value={target}
            onChange={(event) => {
              setTarget(event.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "military-error" : undefined}
            className={INPUT_CLASS}
          />
        </Field>
        <dl className="grid grid-cols-2 gap-3 rounded-md border border-line bg-sunken px-3 py-2.5 text-sm">
          <div>
            <dt className="text-xs text-muted">Ships sent</dt>
            <dd className="font-semibold tabular-nums">
              {formatNumber(shipCount)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Energy cost</dt>
            <dd
              className={`font-semibold tabular-nums ${
                isAttack && !canAffordAttack ? "text-hostile" : ""
              }`}
            >
              {isAttack
                ? `${formatNumber(energyCost)} of ${formatNumber(paPlayer.energy)}`
                : "Free"}
            </dd>
          </div>
        </dl>
        {error && (
          <p id="military-error" role="alert" className="text-sm text-hostile">
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant={isAttack ? "danger" : "primary"}
          disabled={isLoading || (isAttack && !canAffordAttack)}
          extraClasses="w-full sm:w-auto sm:self-start"
        >
          {isAttack ? <LuSwords aria-hidden /> : <LuShield aria-hidden />}
          {isAttack ? "Launch attack" : "Send defence"}
        </Button>
      </form>
    </Panel>
  );
};

export default Military;
