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
      <aside
        className={clsx(styles.navWrapper, "p-[12px] z-1 bg-neutral-900/75  backdrop-blur-xl")}
        ref={nodeRef}
      >
        <div className="flex mb-6 h-[44px]">
          <button className="ml-auto mr-0 cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-3xl">{"Task'Em!"}</h1>
          </button>
        </div>
        <CreateProject />
        <ProjectList />
      </aside>
    </CSSTransition>
  );
}
export default Sidebar;
