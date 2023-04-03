import Button, { ButtonProps } from "../button/Button";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface NavButton extends ButtonProps {
  visible: boolean;
}

const NavButton = ({ onClick, className, visible }: NavButton) => {
  if (!visible) {
    return null;
  }

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
