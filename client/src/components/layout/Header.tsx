import { useRef, useState } from "react";
import NavButton from "../header/NavButton";
import Sidebar from "../header/Sidebar";
// import { AccountMenu } from "../header/AccountMenu";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
  };

  return (
    <header className="flex relative">
      <NavButton ref={menuButtonRef} active={showNav} onClick={() => handleNavigation()} />
      {/* <AccountMenu /> */}
      {location.pathname === "/" && (
        <Link
          to="/login"
          className="flex justify-center items-center text-sm mt-4 mb-3 mr-[12px] ml-auto bg-neutral-100 px-7 rounded-2xl transition-colors transition-600 hover:bg-neutral-200 active:bg-neutral-300 font-semibold"
        >
          Login
        </Link>
      )}

      <Sidebar
        visible={showNav}
        menuButtonRef={menuButtonRef}
        handleNavigation={handleNavigation}
      />
    </header>
  );
}
export default Header;
