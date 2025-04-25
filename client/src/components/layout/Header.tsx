import Sidebar from "../header/Sidebar";
import { AccountMenu } from "../header/AccountMenu";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { Button, useDisclosure } from "@heroui/react";
import { CgMenuGridR } from "react-icons/cg";

function Header() {
  const { loading, loggedIn } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <header className="flex relative">
      <Button onPress={onOpen} isIconOnly className="size-16 bg-opacity-0">
        <CgMenuGridR className="size-16" />
      </Button>
      {!loading &&
        (loggedIn ? (
          <AccountMenu />
        ) : (
          location.pathname === "/" && (
            <Link
              to="/login"
              className="flex justify-center items-center text-sm mt-4 mb-3 mr-[12px] ml-auto bg-neutral-100 px-7 rounded-2xl transition-colors transition-600 hover:bg-neutral-200 active:bg-neutral-300 font-semibold"
            >
              Login
            </Link>
          )
        ))}

      <Sidebar isOpen={isOpen} onOpenChange={onOpenChange} />
    </header>
  );
}
export default Header;
