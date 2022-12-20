import Button, { ButtonProps } from "../button/Button";
import clsx from "clsx";
import styles from "./NavButton.module.scss";

const NavButton = ({ onClick, className }: ButtonProps) => {
  return (
    <Button onClick={onClick} className={clsx(styles.menuButton, className)}>
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
