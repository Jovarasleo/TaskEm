import clsx from "clsx";
import { RefObject, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import useOutsideClick from "../../hooks/useOutsideClick";
import CreateProject from "../../views/taskManager/components/project/CreateProject";
import ProjectList from "../../views/taskManager/components/project/ProjectList";

interface NavbarProps {
  visible: boolean;
  menuButtonRef: RefObject<HTMLElement>;
  handleNavigation: () => void;
}

function Sidebar({ visible, menuButtonRef, handleNavigation }: NavbarProps) {
  const nodeRef = useRef(null);
  const navigate = useNavigate();

  useOutsideClick(() => (visible ? handleNavigation() : {}), [nodeRef, menuButtonRef]);

  return (
    <CSSTransition
      in={visible}
      timeout={600}
      nodeRef={nodeRef}
      classNames={{
        enterActive: "sm:translate-x-[0px] translate-x-[0px]",
        enterDone: "sm:translate-x-[0px] translate-x-[0px]",
      }}
      unmountOnExit
    >
      <aside
        className={clsx(
          "fixed h-full transition-transform duration-400 p-[12px] z-1 bg-neutral-900/80 backdrop-blur-xl sm:-translate-x-[400px] -translate-x-[640px] sm:max-w-[400px] max-w-[640px] w-full text-white"
        )}
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
