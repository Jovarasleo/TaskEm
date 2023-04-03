import { useState, useRef } from "react";
import NavButton from "./NavButton";
import Navbar from "./Navbar";
import useOutsideClick from "../../hooks/useOutsideClick";
import styles from "./styles.module.scss";

function Header() {
  const [showNav, setShowNav] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const outsideClickRef = useRef<HTMLTextAreaElement>(null);
  useOutsideClick(() => setShowNav(false), outsideClickRef);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
    setShowButton(false);
  };

  return (
    <>
      <header className={styles.header} ref={outsideClickRef}>
        <NavButton onClick={handleNavigation} visible={showButton} />
        <Navbar
          handleNavigation={handleNavigation}
          handleButton={setShowButton}
          visible={showNav}
        />
      </header>
    </>
  );
}
export default Header;
