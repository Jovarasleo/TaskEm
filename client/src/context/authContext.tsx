import { createContext, useEffect, useState } from "react";
const DEFAULT_TOKEN = {
  loading: false,
  token: localStorage.getItem("token") || "",
  error: null,
};

interface IAuth {
  setToken: (token: string) => void;
}

const AuthContext: any = createContext(DEFAULT_TOKEN);
const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(DEFAULT_TOKEN.loading);
  const [token, setToken] = useState(DEFAULT_TOKEN.token);
  const [tokenError, setTokenError] = useState(DEFAULT_TOKEN.error);

  useEffect(() => {
    localStorage.setItem("token", token);
    // console.log(token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        loading,
        setLoading,
        tokenError,
        setTokenError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
export { AuthProvider };
