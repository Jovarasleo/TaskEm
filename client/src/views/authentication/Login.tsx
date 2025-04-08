import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { object, string } from "yup";
import Button from "../../components/button/Button";
import { AppDispatch, RootState } from "../../store/configureStore";
import { loginUser } from "../../store/slices/authSlice";
import styles from "./authenticate.module.scss";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/input/Input";

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
  const navigate = useNavigate();
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

  const submit = handleSubmit(async (formValues) => {
    const resultAction = await dispatch(loginUser(formValues));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  });

  const handleGoogleOAuth = () => {
    window.location.href = `${process.env.BACKEND_ADDRESS}/auth/google`;
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.CLIENT_ID ?? "",
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
          <Input id="email" label="Email" {...register("email")} />
          <p className={styles.formError}>{errors.email?.message}</p>
        </div>
        <div className={styles.loginFormField}>
          <Input id="password" label="Password" type="password" {...register("password")} />
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
        <Button className="py-2 font-semibold" loading={loading} onClick={submit} type="primary">
          Login
        </Button>
      </form>

      <div id="google-login-btn" className={styles.googleLoginBtn}></div>
    </>
  );
}
export default Login;
