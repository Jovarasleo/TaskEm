import { Route, Routes } from "react-router-dom";
import TaskManager from "./views/taksManager/TaskManager";
import Login from "./views/login/Login";
import Layout from "./components/layout/Layout";

function App(): JSX.Element {
  return (
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
  );
}
export default App;
