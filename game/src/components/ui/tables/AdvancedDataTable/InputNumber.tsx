import { forwardRef } from "react";

import { INPUT_CLASS } from "@/components/ui/Field";
import { formatNumber } from "@/utils/functions";

interface IInputNumberProps {
  id?: string;
  /** Accessible name, e.g. "Amount of Houses" */
  label?: string;
  /** The largest amount the player can afford; adds a "Max" button */
  max?: number | null;
}

/** A quantity input with an optional "Max" shortcut. */
const InputNumber = forwardRef<HTMLInputElement, IInputNumberProps>(
  ({ id, label = "Amount", max }, ref) => {
    const fillMax = () => {
      if (ref && typeof ref === "object" && ref.current && max != null) {
        ref.current.value = String(max);
        ref.current.focus();
      }
    };

    return (
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <input
          type="number"
          inputMode="numeric"
          aria-label={label}
          className={`${INPUT_CLASS} w-20 text-right tabular-nums sm:w-28`}
          id={id}
          placeholder="0"
          ref={ref}
          defaultValue={0}
          min="0"
          max={max ?? undefined}
        />
        {max != null && (
          <button
            type="button"
            onClick={fillMax}
            title={`Set to the maximum you can afford (${formatNumber(max)})`}
            className="rounded-md px-1 text-xs font-semibold text-accent hover:bg-accent/10 sm:h-10 sm:px-2"
          >
            Max
          </button>
        )}
      </div>
    );
  },
);

InputNumber.displayName = "InputNumber";
export default InputNumber;
