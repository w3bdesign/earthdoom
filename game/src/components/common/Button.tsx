import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  extraClasses?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-ink hover:bg-accent-strong focus-visible:bg-accent-strong",
  secondary:
    "border border-line-strong bg-raised text-ink hover:border-muted/60 hover:bg-line",
  danger:
    "border border-hostile/40 bg-hostile/10 text-hostile hover:bg-hostile/20",
  ghost: "text-muted hover:bg-raised hover:text-ink",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

/**
 * Button component
 * @param {IButtonProps} props - The props for the Button component
 * @returns {JSX.Element} - The Button component
 */
export const Button: React.FC<IButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled,
  extraClasses = "",
  type = "button",
  ...rest
}) => {
  const classNames = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${extraClasses}`;

  return (
    <button type={type} disabled={disabled} className={classNames} {...rest}>
      {children}
    </button>
  );
};

export default Button;
