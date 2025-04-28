import { ReactElement, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch } from "../../store/configureStore";
import { useDispatch } from "react-redux";
import { clearAuthError } from "../../store/slices/authSlice";
import "./authenticate.css";

interface Props {
  children: ReactElement | ReactNode;
}

function Authenticate({ children }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  const clearErrors = () => dispatch(clearAuthError());

  return (
    <div className="formContainer rounded-2xl">
      <h3 className="formTitle">{location.pathname === "/signup" ? "Register" : "Login"}</h3>
      {children}

      <div className="linkToContainer">
        <div className="flex items-center flex-col">
          {location.pathname === "/signup" ? (
            <>
              <p>Already have an account?</p>
              <Link to="/login" onClick={clearErrors} className="linkBtn">
                Login here
              </Link>
            </>
          ) : (
            <>
              <p>Don&apos;t have an account?</p>
              <Link to="/signup" onClick={clearErrors} className="linkBtn">
                Register here
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Authenticate;
