import styles from "./navbar.module.scss";
import clsx from "clsx";

const NavButton = ({ onClick, style, className }: any) => {
  return (
    <button
      className={clsx(styles.menuButton, className)}
      onClick={onClick}
      style={style}
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
