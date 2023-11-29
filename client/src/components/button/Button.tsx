import { ReactElement, ReactNode } from "react";
import styles from "./button.module.scss";
import clsx from "clsx";
import { RefObject } from "react";

export interface ButtonProps {
  className?: string;
  disabled?: boolean;
  type?: string;
  children?: ReactElement | ReactNode;
  ref?: RefObject<HTMLButtonElement>;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  // onClick: <T>(T?: T) => void;
}

function Button({ className, disabled, type, children, onClick, ref, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, type && styles[type], disabled && styles.disabled, className)}
      onClick={disabled ? undefined : onClick}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
}
export default Button;
