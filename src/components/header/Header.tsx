import { useState, useRef } from "react";
import NavButton from "../navButton/NavButton";
import Navbar from "../navbar/Navbar";
import useOutsideClick from "../../hooks/useOutsideClick";
import styles from "./header.module.scss";

function Header() {
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
    <>
      <header className={styles.header} ref={outsideClickRef}>
        {!showNav ? (
          <NavButton onClick={() => showNavigation()} />
        ) : (
          <Navbar
            animate={animate}
            setAnimate={setAnimate}
            setShowNav={setShowNav}
          />
        )}
      </header>
    </>
  );
}
export default Header;
