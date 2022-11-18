import { ReactElement } from "react";
interface LayoutProps {
  children: ReactElement;
}
function Layout({ children }: LayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
export default Layout;
