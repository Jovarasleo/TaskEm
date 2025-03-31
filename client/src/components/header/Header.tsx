import { useRef, useState } from "react";
import NavButton from "./NavButton";
import Sidebar from "./Sidebar";
import { AccountMenu } from "./AccountMenu";

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
