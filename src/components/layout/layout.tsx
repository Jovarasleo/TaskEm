import { ReactElement } from "react";
import Navbar from "../navbar/navbar";
import { TaskProvider } from "../../context/taskContext";

interface LayoutProps {
  children: ReactElement;
}
function Layout({ children }: LayoutProps) {
  return (
    <>
      <TaskProvider>
        <Navbar />
        <main>{children}</main>
      </TaskProvider>
    </>
  );
}
export default Layout;
