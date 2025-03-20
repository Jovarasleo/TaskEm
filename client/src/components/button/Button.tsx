import { ReactElement, ReactNode, RefObject } from "react";
import styles from "./button.module.scss";
import clsx from "clsx";

export interface ButtonProps {
  type?: "link" | "select";
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
  return (
    <button
      ref={ref}
      className={clsx(
        styles.button,
        type && styles[type],
        (disabled || loading) && styles.disabled,
        className
      )}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      {...rest}
    >
      {loading && <span className={styles.loader} />}
      {children}
    </button>
  );
}
export default Button;
