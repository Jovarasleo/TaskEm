import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { useGetUserQuery } from "../../api/user";
import NavButton from "./NavButton";
import Sidebar from "./Sidebar";
import styles from "./styles.module.scss";

function Header() {
  const { userData } = useSelector((state) => (state as RootState).auth);

  // automatically authenticate user if token is found
  const { data } = useGetUserQuery("userDetails", {
    // perform a refetch every 15mins
    pollingInterval: 900000,
  });

  console.log({ data, userData });
  const [showNav, setShowNav] = useState(false);

  const handleNavigation = () => {
    setShowNav((prevState) => !prevState);
  };

  return (
    <>
      <header className={styles.header}>
        <NavButton onClick={() => handleNavigation()} visible />
      </header>
      <Sidebar visible={showNav} />
    </>
  );
}
export default Header;
