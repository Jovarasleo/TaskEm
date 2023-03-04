import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import NavButton from "./NavButton";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";
import Modal from "../modal/Modal";

interface NavbarProps {
  visible: boolean;
  handleNavigation: () => void;
  handleButton: (show: boolean) => void;
}

function Navbar({ visible, handleNavigation, handleButton }: NavbarProps) {
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
          <h1 className={styles.title}>Task'Em!</h1>
          <NavButton
            onClick={() => handleNavigation()}
            className={styles.active}
            visible={true}
          />
        </div>
        <CreateProject />

        {/* <Modal /> */}
      </nav>
    </CSSTransition>
  );
}
export default Navbar;
