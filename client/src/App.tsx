import { Route, Routes } from "react-router-dom";
import TaskManager from "./views/taksManager/TaskManager";
import Login from "./views/login/Login";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store/configureStore";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Provider store={store}>
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
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
