import Button, { ButtonProps } from "../button/Button";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface NavButton extends ButtonProps {
  active: boolean;
}

const NavButton = ({ onClick, active, className }: NavButton) => {
  return (
    <Button
      onClick={onClick}
      className={clsx(styles.menuButton, active && styles.active, className)}
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
    </Button>
  );
};
export default NavButton;
