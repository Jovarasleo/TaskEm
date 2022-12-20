import { ReactElement } from "react";
import Header from "../header/Header";
import { TaskProvider } from "../../context/taskContext";

interface LayoutProps {
  children: ReactElement;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <TaskProvider>
        <Header />
        <main>{children}</main>
      </TaskProvider>
    </>
  );
}
export default Layout;
