import type { PaUsers } from "@prisma/client";
import type { FC } from "react";

interface IAllianceProps {
  paPlayer: PaUsers;
}

const Alliance: FC<IAllianceProps> = ({ paPlayer }) => {
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
                <div className="relative mb-12 w-64" data-te-input-wrapper-init>
                  <input
                    type="text"
                    className="peer block min-h-[auto]  rounded border-0 px-3  py-[0.32rem] leading-[1.6] text-neutral-600 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none "
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    pattern="[A-Za-z]+"
                    title="Please enter letters only"
                  />
                  <label
                    htmlFor="exampleInputEmail1"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-700 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    Create alliance
                  </label>
                </div>
                <div className="relative mb-12 w-64" data-te-input-wrapper-init>
                  <input
                    type="text"
                    className="peer block min-h-[auto]  rounded border-0 px-3  py-[0.32rem] leading-[1.6] text-neutral-600 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none "
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    pattern="[A-Za-z]+"
                    title="Please enter letters only"
                  />
                  <label
                    htmlFor="exampleInputEmail1"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-700 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    Join alliance
                  </label>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    Submit
                  </button>
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
