import { useContext, useState } from "react";
import { createUser } from "../../api/user";
import AuthContext from "../../context/authContext";

function Login() {
  const [user, setUser] = useState({
    password: "",
    email: "",
  });

  const { mutate, error, data } = createUser(user);
  const { setToken, token } = useContext(AuthContext);

  const handleUserChange = (stat: string, value: string) => {
    setUser((prevState) => {
      return { ...prevState, [stat]: value };
    });
  };

  console.log(token, data);

  if (data?.response?.token) {
    setToken(data?.response.token);
  }

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
        <form
          action="submit"
          className="loginForm"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => handleUserChange(e.target.name, e.target.value)}
          /> */}
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
          <button type="submit" onClick={() => mutate()}>
            Login
          </button>
        </form>
      </h1>
    </main>
  );
}
export default Login;
