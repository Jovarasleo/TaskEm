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
  const { userData } = useSelector((state) => (state as RootState).auth);
  const navigate = useNavigate();

  // automatically authenticate user if token is found
  const { data } = useGetUserQuery("userDetails", {
    // perform a refetch every 15mins
    pollingInterval: 900000,
  });
  const dispatch: AppDispatch = useDispatch();

  const [showNav, setShowNav] = useState(false);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
  };

  return (
    <>
      <header className={styles.header}>
        <NavButton onClick={() => handleNavigation()} visible />
        <Button onClick={() => navigate("/login")} className={styles.userButton}>
          <CgUserlane />
        </Button>
        <Button onClick={() => dispatch(logoutUser())}>Logout</Button>
      </header>
      <Sidebar visible={showNav} />
    </>
  );
}
export default Header;
