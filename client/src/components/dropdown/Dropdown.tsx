import styles from "./dropdown.module.scss";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";
import { useRef, useState } from "react";
import Button from "../button/Button";
import useOutsideClick from "../../hooks/useOutsideClick";
import { GoGear } from "react-icons/go";

const Dropdown = ({
  options,
}: {
  options: {
    title: string;
    onClick: () => void;
  }[];
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const nodeRef = useRef(null);
  const dropdownRef = useRef(null);

  useOutsideClick(() => setShowOptions(false), dropdownRef);

  const handleDropdown = () => {
    setShowOptions((prevState) => !prevState);
  };

  return (
    <div ref={dropdownRef} className={styles.dropdownWrapper}>
      <Button
        onClick={() => handleDropdown()}
        className={clsx(styles.projectSettingsGear, showOptions && styles.activeGear)}
      >
        <GoGear />
      </Button>
      <CSSTransition
        in={showOptions}
        nodeRef={nodeRef}
        timeout={300}
        classNames={{
          enterActive: styles.transition,
          enterDone: styles.transition,
        }}
        unmountOnExit
      >
        <div ref={nodeRef} className={clsx(styles.dropdown)}>
          <ul>
            {options?.map(({ title, onClick }) => {
              return (
                <li key={title} className={styles.dropdownElement}>
                  <Button
                    onClick={() => {
                      onClick();
                      handleDropdown();
                    }}
                  >
                    {title}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Dropdown;
