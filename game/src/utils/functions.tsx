/**
 * Props for the Stringifier component
 * @typedef {Object} IStringifierProps
 * @property {string | number | bigint} value - The value to stringify
 */
interface IStringifierProps {
  value?: string | number | bigint;
}

/**
 * Converts a value to a string and renders it as a React element.
 * @param {IStringifierProps} props - The props for the component
 * @returns {JSX.Element} The stringified value as a React element
 */
export function Stringifier({ value }: IStringifierProps) {
  let stringifiedValue: string;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint"
  ) {
    stringifiedValue = String(value);
  } else {
    stringifiedValue = "";
  }
  return <span>{stringifiedValue}</span>;
}
