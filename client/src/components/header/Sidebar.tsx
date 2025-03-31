import clsx from "clsx";
import { RefObject, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import useOutsideClick from "../../hooks/useOutsideClick";
import CreateProject from "../../views/taskManager/components/project/CreateProject";
import ProjectList from "../../views/taskManager/components/project/ProjectList";
import styles from "./styles.module.scss";

interface NavbarProps {
  visible: boolean;
  menuButtonRef: RefObject<HTMLElement>;
  handleNavigation: () => void;
}

function Sidebar({ visible, menuButtonRef, handleNavigation }: NavbarProps) {
  const nodeRef = useRef(null);
  const navigate = useNavigate();
  useOutsideClick(() => handleNavigation(), [nodeRef, menuButtonRef]);

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
      <aside className={clsx(styles.navWrapper)} ref={nodeRef}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title} onClick={() => navigate("/")}>
            {"Task'Em!"}
          </h1>
        </div>
        <ProjectList />
        <CreateProject />
      </aside>
    </CSSTransition>
  );
}
export default Sidebar;
