import clsx from "clsx";
import { forwardRef } from "react";
import "./input.css";

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
    <div className="flex flex-col gap-0.5 floating">
      <input
        id={id}
        type={type}
        ref={ref}
        className={clsx(className, "border-b-1 border-neutral-400 px-3 py-0.75 floatingInput")}
        placeholder={label}
        {...rest}
      />
      <label
        htmlFor={id}
        data-content={label}
        className="text-neutral-600 text-sm font-semibold top-0 floatingLabel"
      >
        <span className="hidden">{label}</span>
      </label>
    </div>
  );
});
