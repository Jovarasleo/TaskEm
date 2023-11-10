import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./views/login/Login";
import Register from "./views/login/Register";
import TaskManager from "./views/taksManager/TaskManager";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<TaskManager />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
