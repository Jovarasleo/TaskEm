import { useEffect } from "react";

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
    <main
      style={{
        height: "calc(100vh - 80px) ",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div id="google-login-btn"></div>
    </main>
  );
}
export default Login;
