import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Link from "next/link";

import { type NextPage } from "next";

import { api } from "@/utils/api";

import { Layout } from "@/components/common/Layout";
import Button from "@/components/ui/common/Button";

const Country: NextPage = () => {
  // https://tailwind-elements.com/docs/standard/data/tables/

  const { data: paPlayers } = api.paUsers.getAll.useQuery();

  const [myx, setMyx] = useState<number>(1);

  const handleChange = (event: { target: { value: string | number } }) => {
    const { value } = event.target;
    if (Number.isInteger(Number(value))) {
      setMyx(Number(value));
    }
  };

  const handlePrev = () => {
    setMyx(myx - 1);
  };

  const handleNext = () => {
    setMyx(myx + 1);
  };

  return (
    <>
      <Layout>
        <main className="bg-neutral-900">
          <div className="flex justify-center">
            <div className="my-6 mt-16">
              <Button onClick={() => handlePrev}>
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
                onChange={() => handleChange}
              />
              <Button onClick={() => handleNext}>
                Next
                <BsArrowRight className="ml-2 inline-block" />
              </Button>
            </div>
          </div>
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative py-4 sm:mx-auto">
              <div className="relative mb-6 w-full break-words p-6 shadow-lg">
                <img
                  src="https://via.placeholder.com/250"
                  alt=""
                  className="mx-auto max-w-[250px] text-center"
                />
              </div>
              <table className="w-full text-left ring-1 ring-slate-400/10">
                <caption className="mb-10 text-xl font-medium text-white ">
                  Continent name here <br />
                  Score: 1000000
                </caption>
                <tbody>
                  <tr>
                    <th
                      scope="col"
                      className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12 bg-slate-200/90 px-6 text-center text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Tag
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12 bg-slate-200/90 px-6  text-center text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Nick
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12 bg-slate-200/90 px-6 text-center  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6 text-center text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Spying
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12 bg-slate-200/90  px-6 text-center text-base font-bold  text-black backdrop-blur-sm first:border-l-0 sm:table-cell"
                    >
                      Mail
                    </th>
                  </tr>
                  {paPlayers?.map((player) => (
                    <tr
                      key={player.id}
                      className="block border-b bg-white text-center last:border-b-0 sm:table-row sm:border-none"
                    >
                      <td
                        data-th="Name"
                        className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {player.y}
                      </td>
                      <td
                        data-th="Tag"
                        className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {player.tag}
                      </td>
                      <td
                        data-th="Name"
                        className="flex h-12 items-center px-6 text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        <span
                          className={`text-${
                            player.commander === 1 ? "red" : "blue"
                          }`}
                        >
                          {player.nick}
                        </span>
                        {Date.now() - player.timer < 600000 && (
                          <span className="text-green-500"> (ONLINE)</span>
                        )}
                      </td>

                      <td
                        data-th="Score"
                        className="flex h-12 items-center px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {player.score.toString()}
                      </td>

                      <td
                        data-th="Spying"
                        className="flex h-12 items-center px-6  text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
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
                      <td
                        data-th="Mail"
                        className="flex h-12 items-center px-6  text-center text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0  sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        <Link href={`/mail?id=${player.id}`}>
                          <Button
                            type="button"
                            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
                            onClick={() => {
                              alert(player.id);
                            }}
                          >
                            Mail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Country;
