import { useState } from "react";
import Button from "../../components/button/Button";
import styles from "./authenticate.module.scss";
import { useCreateUserMutation } from "../../api/user";
function Register() {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [createUser, result] = useCreateUserMutation();

  const handleUserChange = (stat: string, value: string) => {
    setUser((prevState) => {
      return { ...prevState, [stat]: value };
    });
  };

  const missmatch = user.password !== user.repeatPassword;
  console.log({ result });

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
              name="repeatPassword"
              type="password"
              placeholder="Repeat Password"
              onChange={(e) => handleUserChange(e.target.name, e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={missmatch}
            onClick={() =>
              createUser({
                username: user.username,
                password: user.password,
                email: user.email,
              })
            }
          >
            Register
          </Button>
        </form>
        {result.error ? <div>{result.error?.data.error}</div> : null}
        {result.data?.message ? <div>{result.data.message}</div> : null}
        {/* {result.error ? <div>{result.error}</div> : null} */}
      </h1>
    </main>
  );
}
export default Register;
