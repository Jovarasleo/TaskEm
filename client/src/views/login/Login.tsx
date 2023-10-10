import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/configureStore";
import { loginUser } from "../../store/slices/authSlice";

function Login() {
  const [user, setUser] = useState({
    password: "",
    email: "",
  });

  const handleUserChange = (stat: string, value: string) => {
    setUser((prevState) => {
      return { ...prevState, [stat]: value };
    });
  };

  const dispatch: AppDispatch = useDispatch();
  const { loading, userData, error, message, userToken, success } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (success && userToken) {
      navigate("/");
    }
  }, [navigate, success, userToken]);

  const submitForm = (data: { email: string; password: string }) => {
    dispatch(
      loginUser({
        email: data.email.toLowerCase(),
        password: data.password,
      })
    );
  };

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
        Login screen
        <form action="submit" className="loginForm" onSubmit={(e) => e.preventDefault()}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => handleUserChange(e.target.name, e.target.value)}
          />
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={(e) => handleUserChange(e.target.name, e.target.value)}
          />
          <button type="submit" onClick={() => submitForm(user)}>
            Login
          </button>
          {error ? <div>{error}</div> : null}
        </form>
      </h1>
    </main>
  );
}
export default Login;
