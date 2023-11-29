import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { useGetUserQuery } from "../../api/user";
import { CgUserlane } from "react-icons/cg";
import NavButton from "./NavButton";
import Sidebar from "./Sidebar";
import styles from "./styles.module.scss";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import { logoutUser } from "../../store/slices/authSlice";

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
