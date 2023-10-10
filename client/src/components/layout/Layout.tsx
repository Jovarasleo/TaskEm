import { ReactElement, useContext } from "react";
import Header from "../header/Header";
import { TaskProvider } from "../../context/taskContext";
import AuthContext from "../../context/authContext";

interface LayoutProps {
  children: ReactElement;
}

function Layout({ children }: LayoutProps) {
  const { token } = useContext(AuthContext);
  console.log(token);

  return (
    <>
      <TaskProvider>
        <Header token={token} />
        <main>{children}</main>
      </TaskProvider>
    </>
  );
}
export default Layout;
