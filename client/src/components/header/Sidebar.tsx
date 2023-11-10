import clsx from "clsx";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { RootState } from "store/configureStore";
import CreateProject from "../../views/taksManager/components/createProject/CreateProject";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  visible: boolean;
}

function Sidebar({ visible }: NavbarProps) {
  const nodeRef = useRef(null);
  const navigate = useNavigate();

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
          <h1 className={styles.title} onClick={() => navigate("/")}>
            {"Task'Em!"}
          </h1>
        </div>
        <CreateProject />
      </nav>
    </CSSTransition>
  );
}
export default Sidebar;
