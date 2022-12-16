import { useState, useRef } from "react";
import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import NavButton from "./navButton";
import useOutsideClick from "../../hooks/useOutsideClick";
import clsx from "clsx";
import styles from "./navbar.module.scss";

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [animate, setAnimate] = useState(false);

  const outsideClickRef = useRef<HTMLTextAreaElement>(null);
  useOutsideClick(() => setAnimate(false), outsideClickRef);

  function showNavigation() {
    setShowNav(true);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 5);
    return () => clearTimeout(timer);
  }

  return (
    <header className={styles.header} ref={outsideClickRef}>
      {!showNav ? (
        <NavButton onClick={showNavigation} />
      ) : (
        <nav
          className={clsx(styles.navWrapper, animate && styles.animate)}
          onTransitionEnd={() => {
            !animate && setShowNav(false);
          }}
        >
          <div className={styles.titleWrapper}>
            <h1>Task'Em!</h1>
            <NavButton
              onClick={() => setAnimate(false)}
              className={styles.active}
            />
          </div>
          <CreateProject />
        </nav>
      )}
    </header>
  );
}
export default Navbar;
