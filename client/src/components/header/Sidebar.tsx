import { Link } from "react-router-dom";
import CreateProject from "../../views/taskManager/components/project/CreateProject";
import ProjectList from "../../views/taskManager/components/project/ProjectList";
import { Drawer, DrawerContent } from "@heroui/react";

interface NavbarProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

function Sidebar({ isOpen, onOpenChange }: NavbarProps) {
  return (
    <Drawer
      isDismissable
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      backdrop="blur"
      placement="left"
      portalContainer={document.querySelector("main") ?? document.body}
    >
      <DrawerContent className="p-2">
        <div className="flex mb-6 h-[44px]">
          <Link to="/">
            <h1 className="text-3xl">{"Task'Em!"}</h1>
          </Link>
        </div>
        <CreateProject />
        <ProjectList />
      </DrawerContent>
    </Drawer>
  );
}
export default Sidebar;
