import { useRef, useState } from "react";
import NavButton from "../header/NavButton";
import Sidebar from "../header/Sidebar";
import { AccountMenu } from "../header/AccountMenu";

function Header() {
  const [showNav, setShowNav] = useState(false);
  const menuButtonRef = useRef(null);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
  };

  return (
    <header className="flex relative">
      <NavButton ref={menuButtonRef} active={showNav} onClick={() => handleNavigation()} />
      <AccountMenu />
      <Sidebar
        visible={showNav}
        menuButtonRef={menuButtonRef}
        handleNavigation={handleNavigation}
      />
    </header>
  );
}
export default Header;
