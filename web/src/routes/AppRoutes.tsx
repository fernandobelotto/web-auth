import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Home } from "../pages/Home";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import Payments from "../pages/Payments";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        <Route
          index
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/dashboard"
          element={<Home />}
        />
        <Route
          path="/payments"
          element={<Payments />}
        />
      </Route>
    </Routes>
  );
}

