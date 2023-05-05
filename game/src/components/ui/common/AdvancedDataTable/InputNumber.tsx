import { canAffordToTrain } from "@/utils/functions";

import type { FC, RefObject } from "react";

interface IInputNumberProps {
  canAffordToTrain: typeof canAffordToTrain;
  inputAmountRef: RefObject<HTMLInputElement>;
}

const InputNumber: FC<IInputNumberProps> = ({ inputAmountRef }) => {
  return (
    <td
      data-th="Production"
      className="flex items-center px-6 py-2 text-base text-black transition duration-300 before:inline-block before:w-24 before:font-medium before:text-black before:content-[attr(data-th)':'] first:border-l-0 sm:table-cell  sm:border-l sm:border-t sm:before:content-none md:h-12"
    >
      <input
        type="number"
        aria-label="Amount"
        className="border-1 peer relative block min-h-[auto] w-32 rounded bg-slate-200 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Amount"
        ref={inputAmountRef}
        defaultValue={0}
        min="0"
      />
    </td>
  );
};

export default InputNumber;
