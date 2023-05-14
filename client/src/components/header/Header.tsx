import { useState, useRef } from "react";
import NavButton from "./NavButton";
import Navbar from "./Navbar";
import useOutsideClick from "../../hooks/useOutsideClick";
import styles from "./styles.module.scss";
import { login } from "../../api/user";

function Header({ token }: { token: string }) {
  const { data: userData } = login(token);
  const [showNav, setShowNav] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const outsideClickRef = useRef<HTMLTextAreaElement>(null);
  useOutsideClick(() => setShowNav(false), outsideClickRef);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
    setShowButton(false);
  };

  console.log(userData);

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
