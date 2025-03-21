import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./views/authentication/Login";
import Signup from "./views/authentication/Signup";
import TaskManager from "./views/taskManager/TaskManager";
import Authenticate from "./views/authentication/Authenticate";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TaskManager />} />
          <Route
            path="login"
            element={
              <Authenticate>
                <Login />
              </Authenticate>
            }
          />
          <Route
            path="signup"
            element={
              <Authenticate>
                <Signup />
              </Authenticate>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
