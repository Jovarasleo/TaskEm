import { ReactElement, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./authenticate.module.scss";

interface Props {
  children: ReactElement | ReactNode;
}

function Authenticate({ children }: Props) {
  const location = useLocation();

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        {location.pathname === "/register" ? "Register" : "Login"}
      </h3>
      {children}

      <div>
        {location.pathname === "/register" ? (
          <Link to="/login">Already have an account? Login</Link>
        ) : (
          <Link to="/register">Don&apost have an account? Register</Link>
        )}
      </div>
    </div>
  );
}
export default Authenticate;
