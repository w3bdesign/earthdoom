import { useState } from "react";
import Link from "next/link";
import {
  LuChevronLeft,
  LuChevronRight,
  LuGlobe,
  LuMail,
  LuRadar,
} from "react-icons/lu";

import type { NextPage } from "next";
import type { FC } from "react";
import type { PaUsers } from "@prisma/client";

import { api } from "@/utils/api";
import { formatNumber } from "@/utils/functions";

import { Layout } from "@/components/common/Layout";
import { Badge, INPUT_CLASS, PageHeader } from "@/components/ui";

const NAV_BUTTON =
  "inline-flex h-10 items-center gap-1.5 rounded-md border border-line-strong bg-raised px-3 text-sm font-medium text-ink transition-colors hover:bg-line";

/** Navigation controls for browsing continents */
const ContinentNavigation: FC<{
  myx: number;
  onPrev: () => void;
  onNext: () => void;
  onChange: (event: { target: { value: string | number } }) => void;
}> = ({ myx, onPrev, onNext, onChange }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onPrev}
      className={NAV_BUTTON}
      aria-label="Previous continent"
    >
      <LuChevronLeft aria-hidden className="h-4 w-4" />
      <span className="hidden sm:inline">Previous</span>
    </button>
    <input
      className={`${INPUT_CLASS} w-16! text-center tabular-nums`}
      type="text"
      inputMode="numeric"
      name="myx"
      aria-label="Continent number"
      size={5}
      maxLength={3}
      value={myx}
      onChange={onChange}
    />
    <button
      type="button"
      onClick={onNext}
      className={NAV_BUTTON}
      aria-label="Next continent"
    >
      <span className="hidden sm:inline">Next</span>
      <LuChevronRight aria-hidden className="h-4 w-4" />
    </button>
  </div>
);

const TH = "h-10 px-3 text-xs font-medium text-muted lg:px-4";
const TD = "px-3 py-3 align-middle lg:px-4";
const ACTION_LINK =
  "inline-flex h-9 items-center gap-1.5 rounded-md border border-line-strong bg-raised px-2.5 text-sm font-medium text-ink transition-colors hover:bg-line";

/** Single player row in the country table */
const PlayerRow: FC<{ player: PaUsers }> = ({ player }) => (
  <tr className="hover:bg-raised/60">
    <td className={`${TD} text-right text-muted`}>{player.y}</td>
    <td className={TD}>
      <span className="inline-flex flex-wrap items-center gap-2 font-semibold text-ink">
        {player.tag && (
          <span className="text-sm font-normal text-muted">[{player.tag}]</span>
        )}
        <span>{player.nick}</span>
        {player.commander === 1 && <Badge tone="caution">Commander</Badge>}
        {Date.now() - player.timer < 600000 && (
          <Badge tone="friendly">Online</Badge>
        )}
        <span className="block w-full text-xs font-normal text-muted sm:hidden">
          {formatNumber(player.score)} score
        </span>
      </span>
    </td>
    <td className={`${TD} hidden text-right text-ink sm:table-cell`}>
      {formatNumber(player.score)}
    </td>
    <td className={TD}>
      <div className="flex items-center gap-2">
        <Link
          href={`/spy?id=${player.id}`}
          className={ACTION_LINK}
          aria-label={`Spy on ${player.nick}`}
          onClick={() => {
            alert(player.id);
          }}
        >
          <LuRadar aria-hidden className="h-4 w-4" />
          <span className="hidden md:inline">Spy</span>
        </Link>
        <Link
          href={`/mail?id=${player.id}`}
          className={ACTION_LINK}
          aria-label={`Mail ${player.nick}`}
          onClick={() => {
            alert(player.id);
          }}
        >
          <LuMail aria-hidden className="h-4 w-4" />
          <span className="hidden md:inline">Mail</span>
        </Link>
      </div>
    </td>
  </tr>
);

const Country: NextPage = () => {
  const { data: paPlayers } = api.paUsers.getAll.useQuery();

  const [myx, setMyx] = useState<number>(1);

  const handleChange = (event: { target: { value: string | number } }) => {
    const { value } = event.target;
    if (Number.isInteger(Number(value))) {
      setMyx(Number(value));
    }
  };

  const handlePrev = () => setMyx(myx - 1);
  const handleNext = () => setMyx(myx + 1);

  return (
    <Layout>
      <PageHeader
        title="Country"
        description={`Players in continent ${myx}.`}
        actions={
          <ContinentNavigation
            myx={myx}
            onPrev={handlePrev}
            onNext={handleNext}
            onChange={handleChange}
          />
        }
      />
      <section className="overflow-hidden rounded-lg border border-line bg-panel shadow-panel">
        <header className="flex items-center gap-4 border-b border-line px-4 py-4">
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-sunken text-accent"
          >
            <LuGlobe className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink">
              Continent name here
            </h2>
            <p className="text-sm text-muted">Score: {formatNumber(1000000)}</p>
          </div>
        </header>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Players in continent {myx}</caption>
          <thead className="bg-raised">
            <tr>
              <th scope="col" className={`${TH} w-px text-right`}>
                Location
              </th>
              <th scope="col" className={TH}>
                Player
              </th>
              <th
                scope="col"
                className={`${TH} hidden text-right sm:table-cell`}
              >
                Score
              </th>
              <th scope="col" className={`${TH} w-px`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paPlayers?.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export default Country;
