import { Routes, Route } from "react-router-dom";
import { Navbar } from "../Navbar";
import { HomePage, LoginPage, RecoverPage, DashboardPage } from "../pages";
import { PrivateRoute } from "./PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="recover" element={<RecoverPage />} />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};
export default AppRouter;
