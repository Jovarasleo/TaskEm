import clsx from "clsx";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./dropdown.css";

interface Props {
  children: React.ReactNode;
  className?: string;
  options?: {
    node: React.ReactNode;
    key: string;
    onClick: () => void;
  }[];
}

const Dropdown = ({ children, className, options }: Props) => {
  const [showOptions, setShowOptions] = useState(false);

  const nodeRef = useRef(null);
  const dropdownRef = useRef(null);

  useOutsideClick(() => setShowOptions(false), [dropdownRef]);

  const handleDropdown = () => {
    setShowOptions((prevState) => !prevState);
  };

  return (
    <div ref={dropdownRef} className="relative flex">
      <button onClick={() => handleDropdown()} className={clsx(className)}>
        {children}
      </button>
      <CSSTransition
        in={showOptions}
        nodeRef={nodeRef}
        timeout={300}
        classNames={{
          enterActive: "transition",
          enterDone: "transition",
        }}
        unmountOnExit
      >
        {options && options.length && (
          <div ref={nodeRef} className="bg-white p-1 dropdown">
            <ul className="flex gap-0.5 flex-col">
              {options.map(({ key, onClick, node }) => (
                <li key={key}>
                  <button
                    onClick={() => {
                      onClick();
                      handleDropdown();
                    }}
                    className="transition-colors text-gray-900 px-3 py-0.5 group cursor-pointer hover:bg-orange-200 w-full rounded-[2px]"
                  >
                    {node}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CSSTransition>
    </div>
  );
};

export default Dropdown;
