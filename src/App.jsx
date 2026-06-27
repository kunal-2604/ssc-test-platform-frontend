import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModuleStore from "./pages/ModuleStore";
import AdminModules from "./pages/AdminModules";
import MyAccess from "./pages/MyAccess";
import AdminPayments from "./pages/AdminPayments";
import AdminStudentSessions from "./pages/AdminStudentSessions";

import "./App.css";

const HomeRedirect = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/student/dashboard"
            element={
              <RoleRoute allowedRole="STUDENT">
                <StudentDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/student/store"
            element={
              <RoleRoute allowedRole="STUDENT">
                <ModuleStore />
              </RoleRoute>
            }
          />

          <Route
            path="/student/my-access"
            element={
              <RoleRoute allowedRole="STUDENT">
                <MyAccess />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/modules"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminModules />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminPayments />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/student-sessions"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminStudentSessions />
              </RoleRoute>
            }
          />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <h1>Protected Page</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
