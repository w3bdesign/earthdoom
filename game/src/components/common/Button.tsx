import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
  disabled?: boolean;
}

/**
 * Button component
 * @param {ButtonProps} props - The props for the Button component
 * @returns {JSX.Element} - The Button component
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  disabled,
  ...rest
}) => {
  let bgColor: string;
  let hoverBgColor: string;

  if (variant === "primary") {
    bgColor = "bg-primary";
    hoverBgColor = "bg-primary-600";
  } else {
    bgColor = "bg-danger";
    hoverBgColor = "bg-danger-600";
  }

  const classNames = `disabled:opacity-50 inline-block rounded p-8 mb-4 w-32 pb-2 pt-2.5 text-sm leading-normal text-white transition duration-150 ease-in-out ${bgColor} hover:${hoverBgColor} focus:${hoverBgColor}}}`;

  return (
    <button disabled={disabled} className={classNames} {...rest}>
      {children}
    </button>
  );
};

export default Button;
