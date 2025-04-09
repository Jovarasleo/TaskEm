import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import useOutsideClick from "../../hooks/useOutsideClick";
import Button from "../button/Button";
import { AppDispatch } from "../../store/configureStore";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

export function AccountMenu() {
  const [showOptions, setShowOptions] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const logout = async () => await dispatch(logoutUser());

  const nodeRef = useRef(null);
  const dropdownRef = useRef(null);

  useOutsideClick(() => setShowOptions(false), [dropdownRef]);

  const handleDropdown = () => {
    setShowOptions((prevState) => !prevState);
  };

  return (
    <div ref={dropdownRef} className="relative flex ml-auto">
      <button
        className="flex justify-center items-center text-sm mt-2 mr-[12px]  bg-gray-300 rounded-full cursor-pointer w-[50px] h-[50px]"
        onClick={handleDropdown}
      >
        ACC
      </button>
      <CSSTransition
        in={showOptions}
        nodeRef={nodeRef}
        timeout={300}
        classNames={{
          enterActive: "opacity-100",
          enterDone: "opacity-100",
        }}
        unmountOnExit
      >
        <div
          ref={nodeRef}
          className="absolute right-4 transition-opacity opacity-0 top-20 bg-neutral-200 min-w-60 min-h-100 z-10 p-4 rounded-2xl"
        >
          <Button type="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </CSSTransition>
    </div>
  );
}
