import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "store/configureStore";
import NavButton from "./NavButton";
import Sidebar from "./Sidebar";
import styles from "./styles.module.scss";

function Header() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [showNav, setShowNav] = useState(false);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
  };

  return (
    <>
      <header className={styles.header}>
        <NavButton onClick={() => handleNavigation()} active={showNav} />
        {/* <Button onClick={() => navigate("/login")} className={styles.loginBtn}>
          Login
        </Button>
        <Button onClick={() => dispatch(logoutUser())} className={styles.logoutBtn}>
          Logout
        </Button> */}
      </header>
      <Sidebar visible={showNav} />
    </>
  );
}
export default Header;
