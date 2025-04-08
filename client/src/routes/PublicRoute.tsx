import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { loggedIn, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <></>;

  return loggedIn ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
