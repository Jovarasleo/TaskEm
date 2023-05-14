import { Route, Routes } from "react-router-dom";
import TaskManager from "./views/taksManager/TaskManager";
import Login from "./views/login/Login";
import Layout from "./components/layout/Layout";
import AuthContext, { AuthProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<TaskManager />} />
                </Routes>
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
