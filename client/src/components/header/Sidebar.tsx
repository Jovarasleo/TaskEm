import clsx from "clsx";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { RootState } from "store/configureStore";
import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import styles from "./styles.module.scss";

interface NavbarProps {
  visible: boolean;
}

function Sidebar({ visible }: NavbarProps) {
  const { userData } = useSelector((state: RootState) => state.auth);

  const nodeRef = useRef(null);

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
      <nav role="navigation" className={clsx(styles.navWrapper)} ref={nodeRef}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Task&apos;Em!</h1>
        </div>
        {userData ? <div>user: {userData.username}</div> : null}
        <CreateProject />
      </nav>
    </CSSTransition>
  );
}
export default Sidebar;
