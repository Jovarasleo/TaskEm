import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import styles from "./authenticate.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser, registerUser } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store/configureStore";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch: AppDispatch = useDispatch();
  const { loading, userData, error, message, userToken, success } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const submitForm = (data: RegisterUser) => {
    dispatch(
      registerUser({
        username: data.username,
        email: data.email.toLowerCase(),
        password: data.password,
      })
    );
  };

  useEffect(() => {
    if (success && userToken) {
      navigate("/");
    }
  }, [userToken, success, navigate]);

  const handleUserChange = (stat: string, value: string) => {
    setUser((prevState) => {
      return { ...prevState, [stat]: value };
    });
  };

  const missmatch = user.password !== user.confirmPassword;

  return (
    <main
      style={{
        height: "calc(100vh - 80px) ",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          color: "white",
        }}
      >
        Register screen
        <form action="submit" className="loginForm" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.fields}>
            <input
              name="email"
              type="email"
              placeholder="email"
              onChange={(e) => handleUserChange(e.target.name, e.target.value)}
            />
            <input
              name="username"
              type="username"
              placeholder="username"
              onChange={(e) => handleUserChange(e.target.name, e.target.value)}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => handleUserChange(e.target.name, e.target.value)}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => handleUserChange(e.target.name, e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={missmatch}
            onClick={() =>
              submitForm({
                username: user.username,
                password: user.password,
                email: user.email,
              })
            }
          >
            Register
          </Button>
        </form>
        {error ? <div>{error}</div> : null}
        {message ? <div>{message}</div> : null}
      </h1>
    </main>
  );
}
export default Register;
