import styles from "./navbar.module.scss";
import clsx from "clsx";

const NavButton = ({ onClick, style, className }: any) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={clsx(styles.menuButton, className)}
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
};
export default NavButton;
