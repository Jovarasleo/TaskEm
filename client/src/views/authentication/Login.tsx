import { object, string } from "yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./login.module.scss";
import Button from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/configureStore";
import { loginUser } from "../../store/slices/authSlice";

const schema = object({
  email: string().email().required(),
  password: string().required(),
}).required();

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: ({
            client_id,
            callback,
          }: {
            client_id: string;
            callback: () => void;
          }) => void;
          renderButton: (
            Element: HTMLElement | null,
            { theme, size }: { theme: string; size: string }
          ) => void;
        };
      };
    };
  }
}

function Login() {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth); // Get auth state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = handleSubmit((formValues) => {
    dispatch(loginUser(formValues));
  });

  const handleGoogleOAuth = () => {
    window.location.href = `${process.env.BACKEND_ADDRESS}/auth/google`;
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "881970835674-m878muaqie5k0dnad477apcfdb006n6m.apps.googleusercontent.com",
        callback: handleGoogleOAuth,
      });

      window.google.accounts.id.renderButton(document.getElementById("google-login-btn"), {
        theme: "outline",
        size: "large",
      });
    }
  }, []);

  return (
    <>
      <form className={styles.loginForm}>
        <div className={styles.loginFormField}>
          <label htmlFor="email">Email</label>
          <input
            className={styles.fieldInput}
            type="email"
            placeholder="Type your email"
            {...register("email")}
          />
          <p className={styles.formError}>{errors.email?.message}</p>
        </div>
        <div className={styles.loginFormField}>
          <label htmlFor="password">Password</label>
          <input
            className={styles.fieldInput}
            type="password"
            placeholder="Type your password"
            {...register("password")}
          />
          <p className={styles.formError}>{errors.password?.message}</p>
          <Button
            className={styles.forgotPasswordBtn}
            type="link"
            onClick={(e) => e.preventDefault()}
          >
            forgot password?
          </Button>
          {error && <p className={styles.formError}>{error}</p>}
        </div>
        <Button className={styles.formSubmitBtn} loading={loading} onClick={submit}>
          Login
        </Button>
      </form>

      <div id="google-login-btn" className={styles.googleLoginBtn}></div>
    </>
  );
}
export default Login;
