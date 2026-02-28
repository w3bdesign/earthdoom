import type { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
  disabled?: boolean;
  extraClasses?: string;
}

/**
 * Button component
 * @param {IButtonProps} props - The props for the Button component
 * @returns {JSX.Element} - The Button component
 */
export const Button: React.FC<IButtonProps> = ({
  children,
  variant = "primary",
  disabled,
  extraClasses = "",
  ...rest
}) => {
  const isPrimary = variant === "primary";
  const bgColor = isPrimary ? "bg-primary" : "bg-danger";
  const hoverBgColor = isPrimary
    ? "hover:bg-primary-600"
    : "hover:bg-danger-600";
  const focusBgColor = isPrimary
    ? "focus:bg-primary-600"
    : "focus:bg-danger-600";

  const classNames = `disabled:opacity-50 disabled:cursor-not-allowed inline-block rounded p-8 w-32 pb-2 pt-2.5 text-sm leading-normal text-white transition duration-150 ease-in-out ${extraClasses} ${bgColor} ${hoverBgColor} ${focusBgColor}`;

  return (
    <button disabled={disabled} className={classNames} {...rest}>
      {children}
    </button>
  );
};

export default Button;
