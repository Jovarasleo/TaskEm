import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import NavButton from "../NavButton/NavButton";
import clsx from "clsx";
import styles from "./Navbar.module.scss";

interface NavbarProps {
  animate: boolean;
  setAnimate: (value: boolean) => void;
  setShowNav: (value: boolean) => void;
}

function Navbar({ animate, setAnimate, setShowNav }: NavbarProps) {
  return (
    <nav
      className={clsx(styles.navWrapper, animate && styles.animate)}
      onTransitionEnd={() => {
        !animate && setShowNav(false);
      }}
    >
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Task'Em!</h1>
        <NavButton
          onClick={() => setAnimate(false)}
          className={styles.active}
        />
      </div>
      <CreateProject />
    </nav>
  );
}
export default Navbar;
