import { ReactElement } from "react";
import Header from "../header/Header";

interface LayoutProps {
  children: ReactElement;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
export default Layout;
