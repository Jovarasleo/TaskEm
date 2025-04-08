import clsx from "clsx";
import styles from "./input.module.scss";
import { forwardRef } from "react";

interface Props {
  id: string;
  type?: "text" | "password";
  label?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { id, label, className, type = "text", ...rest },
  ref
) {
  return (
    <div className={clsx(styles.floating, "flex flex-col gap-0.5")}>
      <input
        id={id}
        type={type}
        ref={ref}
        className={clsx(
          className,
          styles.floatingInput,
          "border-b-1 border-neutral-400 px-3 py-0.75 "
        )}
        placeholder={label}
        {...rest}
      />
      <label
        htmlFor={id}
        data-content={label}
        className={clsx(styles.floatingLabel, "text-neutral-600 text-sm font-semibold top-0")}
      >
        <span className="hidden">{label}</span>
      </label>
    </div>
  );
});
