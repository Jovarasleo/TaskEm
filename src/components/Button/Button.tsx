import { ReactElement, ReactNode } from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

export interface ButtonProps {
  className?: string;
  type?: string;
  children?: ReactElement | ReactNode;
  onClick: (value?: any) => void;
}
function Button({ className, type, children, onClick, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, type && styles[type], className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
export default Button;
