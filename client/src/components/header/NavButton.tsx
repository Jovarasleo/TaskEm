import { ButtonProps } from "../button/Button";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { forwardRef, LegacyRef } from "react";

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
      className={clsx(styles.menuButton, active && styles.active, className)}
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
