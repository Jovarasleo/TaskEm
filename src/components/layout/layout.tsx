import { ReactElement } from "react";
import Navbar from "../navbar/navbar";
interface LayoutProps {
  children: ReactElement;
}
function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
export default Layout;
