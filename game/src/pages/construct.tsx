import { type NextPage } from "next";

import Layout from "@/components/Layout/Layout";

const startConstruction = (buildingId: number) => {
  alert("Building " + buildingId + " started construction.");
};

const buildings = [
  {
    buildingId: 1,
    buildingName: "Tax collectors",
    buildingDescription: "Automatically collects tax from civilians.",
    buildingETA: 10,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(1);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "Free",
  },
  {
    buildingId: 2,
    buildingName: "Titanium extractor",
    buildingDescription: "Enables titanium extractor.",
    buildingETA: 20,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(2);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "500c",
  },
  {
    buildingId: 3,
    buildingName: "Fusion power plant",
    buildingDescription: "Enables construction of fusion power plants.",
    buildingETA: 50,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(3);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "5000c",
  },
  {
    buildingId: 4,
    buildingName: "Barracks",
    buildingDescription: "Enables training of Light Infantry.",
    buildingETA: 20,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(4);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "2500c 1000t",
  },
  {
    buildingId: 5,
    buildingName: "Robot Factory",
    buildingDescription: "Enables building of advanced robots.",
    buildingETA: 40,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(5);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "5000c 3000t",
  },
  {
    buildingId: 6,
    buildingName: "Hellspawn factory",
    buildingDescription: "Enables building of Hellspawns.",
    buildingETA: 120,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(6);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "10000c 10000t",
  },
  {
    buildingId: 7,
    buildingName: "Ares factory",
    buildingDescription: "Enables building of Ares.",
    buildingETA: 120,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(7);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "20000c 20000t",
  },
  {
    buildingId: 8,
    buildingName: "BDU factory",
    buildingDescription: "Enables building of Ares.",
    buildingETA: 120,
    buildingConstruct: (
      <button
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]"
        onClick={() => {
          startConstruction(8);
        }}
      >
        Construct
      </button>
    ),
    buildingCost: "20000c 20000t",
  },
];

const Game: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Construction
          </h1>
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900 p-6">
            <div className="relative sm:mx-auto">
              <table className="w-full text-left ring-1 ring-slate-400/10">
                <tbody>
                  <tr>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90  px-6 text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      ETA
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Build
                    </th>
                    <th
                      scope="col"
                      className="hidden h-12  bg-slate-200/90 px-6  text-base font-bold  text-black  first:border-l-0 sm:table-cell"
                    >
                      Cost
                    </th>
                  </tr>

                  {buildings.map((building) => (
                    <tr
                      key={building.buildingName}
                      className="block border-b  bg-white last:border-b-0 sm:table-row sm:border-none"
                    >
                      <td
                        data-th="Name"
                        className="flex h-12 items-center px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {building.buildingName}
                      </td>
                      <td
                        data-th="Info"
                        className="flex h-12 items-center  px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        <span className="w-[12.5rem]">
                          {building.buildingDescription}
                        </span>
                      </td>
                      <td
                        data-th="ETA"
                        className="flex h-12 items-center  px-6 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {building.buildingETA}
                      </td>

                      <td
                        data-th="Build"
                        className="flex h-12 items-center  px-6  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {building.buildingConstruct}
                      </td>
                      <td
                        data-th="Cost"
                        className="flex h-12 items-center  px-6  text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 hover:bg-blue-100 sm:table-cell sm:border-l sm:border-t sm:before:content-none"
                      >
                        {building.buildingCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Game;
