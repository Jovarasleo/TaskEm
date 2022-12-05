import { useState, useEffect, useRef } from "react";
import CreateProject from "../../views/projectManager/components/createProject/CreateProject";
import NavButton from "./navButton";
import useOutsideClick from "../../hooks/useOutsideClick";
import clsx from "clsx";
import styles from "./navbar.module.scss";

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [animate, setAnimate] = useState(true);
  const outsideClickRef = useRef<HTMLTextAreaElement>(null);

  useOutsideClick(() => setAnimate(false), outsideClickRef);

  useEffect(() => {
    showNav ? setAnimate(true) : setAnimate(false);
  }, [showNav]);

  return (
    <>
      <header className={styles.header} ref={outsideClickRef}>
        {!showNav && <NavButton onClick={() => setShowNav(!showNav)} />}
        {showNav && (
          <nav
            className={clsx(styles.navWrapper, animate && styles.animate)}
            onTransitionEnd={() => {
              !animate && setShowNav(false);
            }}
          >
            <NavButton
              onClick={() => setAnimate(false)}
              className={styles.active}
            />
            <h2>Task'Em!</h2>
            <ul>
              <li>Home</li>
            </ul>
            <CreateProject />
          </nav>
        )}
      </header>
    </>
  );
}
export default Navbar;
