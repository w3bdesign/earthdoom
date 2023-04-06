import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { data: paPlayer } = api.paUsers.getPlayerById.useQuery({
    Userid: 1,
  });

  let shipCount = 0;

  if (paPlayer) {
    shipCount =
      paPlayer.astropods +
      paPlayer.infinitys +
      paPlayer.wraiths +
      paPlayer.warfrigs +
      paPlayer.destroyers +
      paPlayer.scorpions;
  }

  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 text-white">
          <h1 className="text-center text-2xl font-extrabold tracking-tight sm:text-[3rem]">
            Earth Doom
          </h1>
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative sm:mx-auto">
              <table className="w-full text-left ring-1 ring-slate-400/10">
                <caption className="mb-10 text-xl font-medium text-white ">
                  Units ({shipCount} total)
                </caption>
                <tbody>
                  <tr>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Astropods
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Infinitys
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90  px-6 text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Wraiths
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Warfrigs
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Destroyers
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Scorpions
                    </th>
                  </tr>

                  <tr className="block border-b  bg-white last:border-b-0 sm:table-row sm:border-none">
                    <td
                      data-th="Name"
                      className="flex h-12 items-center  px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                    >
                      {paPlayer?.astropods}
                    </td>
                    <td
                      data-th="Tag"
                      className="flex h-12 items-center  px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                    >
                      {paPlayer?.infinitys}
                    </td>
                    <td
                      data-th="Name"
                      className="flex h-12 items-center  px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                    >
                      {paPlayer?.wraiths}
                    </td>
                    <td
                      data-th="Name"
                      className="flex h-12 items-center  px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                    >
                      {paPlayer?.warfrigs}
                    </td>

                    <td
                      data-th="Name"
                      className="flex h-12 items-center  px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                    >
                      {paPlayer?.destroyers}
                    </td>

                    <td
                      data-th="Name"
                      className="flex h-12 items-center  px-6 text-center  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                    >
                      {paPlayer?.scorpions}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
