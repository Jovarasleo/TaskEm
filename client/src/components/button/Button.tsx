import { ReactElement, ReactNode, RefObject } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import clsx from "clsx";
import "./button.css";

export interface ButtonProps {
  type?: "link" | "select" | "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactElement | ReactNode;
  ref?: RefObject<HTMLButtonElement>;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({
  className,
  disabled,
  loading,
  type,
  children,
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  const css = {
    primary:
      "px-3 py-0.75 border-amber-600 hover:border-amber-700 border border-solid border-2 bg-amber-600 text-white hover:bg-amber-700 transition-300",
    secondary:
      "px-2 py-0.75 border-amber-600 hover:border-amber-700 border border-solid border-2 text-amber-700 hover:text-amber-800 transition-300",
    link: "",
    select: "",
  };
  return (
    <button
      ref={ref}
      className={clsx(
        "cursor-pointer rounded-lg transition-colors flex items-center justify-center gap-2",
        type && css[type],
        "disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:border-neutral-400",
        className
      )}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      {...rest}
    >
      {loading && <AiOutlineLoading3Quarters className="animate-spin size-5" />}
      {children}
    </button>
  );
}
export default Button;
