import { ReactElement, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./authenticate.module.scss";
import { AppDispatch } from "../../store/configureStore";
import { useDispatch } from "react-redux";
import { clearAuthError } from "../../store/slices/authSlice";

interface Props {
  children: ReactElement | ReactNode;
}

function Authenticate({ children }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  const clearErrors = () => dispatch(clearAuthError());

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>{location.pathname === "/signup" ? "Register" : "Login"}</h3>
      {children}

      <div className="linkToContainer">
        {location.pathname === "/signup" ? (
          <div>
            <p>Already have an account?</p>
            <Link to="/login" onClick={clearErrors}>
              Login here
            </Link>
          </div>
        ) : (
          <div>
            <p>Don&apos;t have an account?</p>
            <Link to="/signup" onClick={clearErrors}>
              Register here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
export default Authenticate;
