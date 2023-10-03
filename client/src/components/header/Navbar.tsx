import clsx from "clsx";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import NavButton from "./NavButton";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "store/configureStore";

interface NavbarProps {
  visible: boolean;
  handleNavigation: () => void;
  handleButton: (show: boolean) => void;
}

function Navbar({ visible, handleNavigation, handleButton }: NavbarProps) {
  const { loading, userData, error, message, userToken, success } = useSelector(
    (state: RootState) => state.auth
  );

  const nodeRef = useRef(null);

  const handleShowButton = (visible: boolean) => {
    if (!visible) {
      handleButton(true);
    }
  };

  return (
    <CSSTransition
      in={visible}
      timeout={400}
      nodeRef={nodeRef}
      classNames={{
        enterActive: styles.animate,
        enterDone: styles.animate,
      }}
      unmountOnExit
    >
      <nav
        role="navigation"
        className={clsx(styles.navWrapper)}
        ref={nodeRef}
        onTransitionEnd={() => handleShowButton(visible)}
      >
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Task&apos;Em!</h1>

          <NavButton onClick={() => handleNavigation()} className={styles.active} visible={true} />
        </div>
        {userData ? <div>user: {userData.username}</div> : null}
        <CreateProject />

        {/* <Modal /> */}
      </nav>
    </CSSTransition>
  );
}
export default Navbar;
