import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { object, string, ref } from "yup";
import Button from "../../components/button/Button";
import { AppDispatch, RootState } from "../../store/configureStore";
import { registerUser } from "../../store/slices/authSlice";
import styles from "./authenticate.module.scss";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/input/Input";

const schema = object({
  email: string().email().required(),
  username: string().min(3).required(),
  password: string()
    .required()
    .min(8)
    .matches(/^(?=.*[a-z])/, "must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "must contain at least one number"),
  confirmPassword: string()
    .required("password is a required field")
    .oneOf([ref("password"), ""], "passwords must match"),
}).required();

function Signup() {
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
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = handleSubmit(async (formValues) => {
    const resultAction = await dispatch(registerUser(formValues));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  });

  return (
    <>
      <form className={styles.loginForm}>
        <div className={styles.loginFormField}>
          <Input id="email" label="Email" {...register("email")} />
          <p className={styles.formError}>{errors.email?.message}</p>
        </div>
        <div className={styles.loginFormField}>
          <Input id="username" label="Username" {...register("username")} />
          <p className={styles.formError}>{errors.username?.message}</p>
        </div>
        <div className={styles.loginFormField}>
          <Input id="password" label="Password" {...register("password")} />
          <p className={styles.formError}>{errors.password?.message}</p>
        </div>
        <div className={styles.loginFormField}>
          <Input id="password" label="Password" {...register("confirmPassword")} />
          <p className={styles.formError}>{errors.confirmPassword?.message}</p>
          {error.length > 0 && (
            <ul className={clsx(styles.formError, styles.serverErrors)}>
              {error.map((er) => (
                <li key={er}>{er}</li>
              ))}
            </ul>
          )}
        </div>
        <Button className="py-2 font-semibold" loading={loading} onClick={submit} type="primary">
          Sign Up
        </Button>
      </form>

      <div id="google-login-btn" className={styles.googleLoginBtn}></div>
    </>
  );
}
export default Signup;
