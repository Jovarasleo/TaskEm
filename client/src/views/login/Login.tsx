function Login() {
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
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </h1>
    </main>
  );
}
export default Login;
