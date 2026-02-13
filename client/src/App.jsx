import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import CoordinatorDashboard from "./dashboards/CoordinatorDashboard.jsx";
import HodDashboard from "./dashboards/HodDashboard.jsx";
import DeanDashboard from "./dashboards/DeanDashboard.jsx";
import HeadDashboard from "./dashboards/HeadDashboard.jsx";
import AdminDashboard from "./dashboards/AdminDashboard.jsx";
import AnalyticsDashboard from "./dashboards/AnalyticsDashboard.jsx";

const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <LandingPage />;
  if (role === "EventCoordinator") return <Navigate to="/coordinator" replace />;
  if (role === "HOD") return <Navigate to="/hod" replace />;
  if (role === "Dean") return <Navigate to="/dean" replace />;
  if (role === "InstitutionalHead") return <Navigate to="/head" replace />;
  if (role === "AdminITC") return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/" element={<HomeRedirect />} />

      <Route
        path="/coordinator"
        element={
          <ProtectedRoute roles={["EventCoordinator"]}>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hod"
        element={
          <ProtectedRoute roles={["HOD"]}>
            <HodDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dean"
        element={
          <ProtectedRoute roles={["Dean"]}>
            <DeanDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/head"
        element={
          <ProtectedRoute roles={["InstitutionalHead"]}>
            <HeadDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["AdminITC"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute roles={["Dean", "InstitutionalHead", "AdminITC"]}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
