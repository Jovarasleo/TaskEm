import { useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import useOutsideClick from "../../hooks/useOutsideClick";
import { AppDispatch, RootState } from "../../store/configureStore";
import { logoutUser } from "../../store/slices/authSlice";
import clsx from "clsx";

export function AccountMenu() {
  const { userData } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const nodeRef = useRef(null);
  const dropdownRef = useRef(null);

  useOutsideClick(() => setShowMenu(false), [dropdownRef]);

  const handleDropdown = () => {
    setShowMenu((prevState) => !prevState);
  };

  return (
    <div ref={dropdownRef} className="relative flex ml-auto">
      <button
        className={clsx(
          showMenu ? "bg-neutral-100 text-neutral-800" : "bg-neutral-600 text-neutral-100",
          "flex justify-center items-center text-sm mt-2 mr-[12px]  rounded-full cursor-pointer w-[50px] h-[50px] text-neutral-100"
        )}
        onClick={handleDropdown}
      >
        ACC
      </button>
      <CSSTransition
        in={showMenu}
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
          className="fixed sm:right-4 right-0 transition-opacity opacity-0 sm:top-16 bg-neutral-900/80 backdrop-blur-xl z-10 p-4 rounded-2xl w-full sm:max-w-80 h-full sm:max-h-120 flex flex-col shadow-sm text-neutral-100"
        >
          <button onClick={() => setShowMenu(false)} className="group cursor-pointer self-end">
            <IoIosClose className="size-7 group-hover:text-orange-400 transition-colors" />
          </button>
          <h2 className="mb-4 text-sm font-semibold text-center">{userData.email}</h2>
          <div className="flex-1 flex flex-col items-center">
            <div className="max-h-60 max-w-60 sm:max-h-30 sm:max-w-30 w-full h-full rounded-full bg-neutral-200 flex justify-center items-center text-neutral-800">
              {userData.username.charAt(0)}
            </div>
            <h3 className="text-xl my-4">Hi, {userData.username}!</h3>

            <button className="py-1.5 px-8 rounded-2xl border-[2px] border-neutral-600 cursor-pointer transition-colors hover:border-amber-500/20">
              Manage Account
            </button>
            <button
              className="mt-auto mb-6 cursor-pointer text-xl sm:text-base hover:underline underline-offset-2"
              onClick={() => dispatch(logoutUser())}
            >
              Sign out
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}
