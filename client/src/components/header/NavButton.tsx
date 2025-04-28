import { forwardRef, LegacyRef } from "react";
import { ButtonProps } from "../button/Button";
import clsx from "clsx";
import "./header.css";

interface NavButton extends ButtonProps {
  active: boolean;
}

const NavButton = forwardRef(function NavButton(
  { onClick, active, className }: NavButton,
  ref: LegacyRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={clsx("menuButton", active && "active", className)}
      aria-label="Toggle sidebar"
      onClick={onClick}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </button>
  );
});
export default NavButton;
