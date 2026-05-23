import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Link from "next/link";

import type { NextPage } from "next";
import type { FC } from "react";
import type { PaUsers } from "@prisma/client";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import { Button } from "@/components/ui";

/** Navigation controls for browsing continents */
const ContinentNavigation: FC<{
  myx: number;
  onPrev: () => void;
  onNext: () => void;
  onChange: (event: { target: { value: string | number } }) => void;
}> = ({ myx, onPrev, onNext, onChange }) => (
  <div className="flex justify-center">
    <div className="my-6 mt-16">
      <Button onClick={onPrev}>
        <BsArrowLeft className="mr-2 inline-block" />
        Previous
      </Button>
      <input
        className="mr-2 rounded-lg border px-4 py-2"
        type="text"
        name="myx"
        size={5}
        maxLength={3}
        value={myx}
        onChange={onChange}
      />
      <Button onClick={onNext}>
        Next
        <BsArrowRight className="ml-2 inline-block" />
      </Button>
    </div>
  </div>
);

const TABLE_HEADERS = ["Location", "Tag", "Nick", "Score", "Spying", "Mail"] as const;

/** Table header row */
const CountryTableHeader: FC = () => (
  <tr>
    {TABLE_HEADERS.map((header) => (
      <th
        key={header}
        scope="col"
        className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold text-black first:border-l-0 sm:table-cell"
      >
        {header}
      </th>
    ))}
  </tr>
);

const CELL_CLASS =
  "flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell sm:border-l sm:border-t sm:before:content-none";

/** Single player row in the country table */
const PlayerRow: FC<{ player: PaUsers }> = ({ player }) => (
  <tr
    key={player.id}
    className="block border-b bg-white text-center last:border-b-0 sm:table-row sm:border-none"
  >
    <td data-th="Location" className={CELL_CLASS}>
      {player.y}
    </td>
    <td data-th="Tag" className={CELL_CLASS}>
      {player.tag}
    </td>
    <td data-th="Nick" className={CELL_CLASS}>
      <span className={`text-${player.commander === 1 ? "red" : "blue"}`}>
        {player.nick}
      </span>
      {Date.now() - player.timer < 600000 && (
        <span className="text-green-500"> (ONLINE)</span>
      )}
    </td>
    <td data-th="Score" className={CELL_CLASS}>
      {player.score.toString()}
    </td>
    <td data-th="Spying" className={CELL_CLASS}>
      <Link href={`/spy?id=${player.id}`}>
        <Button
          onClick={() => {
            alert(player.id);
          }}
        >
          Spying
        </Button>
      </Link>
    </td>
    <td data-th="Mail" className={CELL_CLASS}>
      <Link href={`/mail?id=${player.id}`}>
        <Button
          type="button"
          onClick={() => {
            alert(player.id);
          }}
        >
          Mail
        </Button>
      </Link>
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
      <main className="bg-neutral-900">
        <ContinentNavigation
          myx={myx}
          onPrev={handlePrev}
          onNext={handleNext}
          onChange={handleChange}
        />
        <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
          <div className="relative sm:mx-auto">
            <div className="relative mb-6 w-full break-words p-6 shadow-lg">
              <img
                src="https://via.placeholder.com/250"
                alt=""
                className="mx-auto max-w-[15.625rem] text-center"
              />
            </div>
            <table className="mt-2 w-full text-left ring-1 ring-slate-400/10">
              <caption className="mb-10 text-xl font-medium text-white">
                Continent name here <br />
                Score: 1000000
              </caption>
              <tbody>
                <CountryTableHeader />
                {paPlayers?.map((player) => (
                  <PlayerRow key={player.id} player={player} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Country;
