import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./views/authentication/Login";
import Signup from "./views/authentication/Signup";
import TaskManager from "./views/taskManager/TaskManager";
import Authenticate from "./views/authentication/Authenticate";
import PublicRoute from "./routes/PublicRoute";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TaskManager />} />
          <Route
            path="login"
            element={
              <PublicRoute>
                <Authenticate>
                  <Login />
                </Authenticate>
              </PublicRoute>
            }
          />
          <Route
            path="signup"
            element={
              <PublicRoute>
                <Authenticate>
                  <Signup />
                </Authenticate>
              </PublicRoute>
            }
          />
        </Route>
        <Route path="*" element={<h1>Lost?</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
