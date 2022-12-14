import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import NavButton from "../navButton/NavButton";
import clsx from "clsx";
import styles from "./navbar.module.scss";

interface NavbarProps {
  animate: boolean;
  setAnimate: (value: boolean) => void;
  setShowNav: (value: boolean) => void;
}

function Navbar({ animate, setAnimate, setShowNav }: NavbarProps) {
  function closeMenu() {
    setShowNav(false);
  }

  function removeAnimate() {
    setAnimate(false);
  }

  return (
    <nav
      role="navigation"
      className={clsx(styles.navWrapper, animate && styles.animate)}
      onTransitionEnd={() => {
        !animate && closeMenu();
      }}
    >
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Task'Em!</h1>
        <NavButton onClick={removeAnimate} className={styles.active} />
      </div>
      <CreateProject />
    </nav>
  );
}
export default Navbar;
