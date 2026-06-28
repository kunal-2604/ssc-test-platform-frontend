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
import AdminTests from "./pages/AdminTests";
import CreateTest from "./pages/CreateTest";
import AddQuestions from "./pages/AddQuestions";
import StudentTests from "./pages/StudentTests";
import TestInstructions from "./pages/TestInstructions";
import TestAttempt from "./pages/TestAttempt";
import TestResult from "./pages/TestResult";
import AdminTestAttempts from "./pages/AdminTestAttempts";
import AdminReports from "./pages/AdminReports";
import AdminResultDetail from "./pages/AdminResultDetail";
import AdminStudents from "./pages/AdminStudents";
import AdminStudentDetail from "./pages/AdminStudentDetail";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ServerWakeUp from "./components/ServerWakeUp";

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
    <>
    <ServerWakeUp />
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
            path="/student/tests"
            element={
              <RoleRoute allowedRole="STUDENT">
                <StudentTests />
              </RoleRoute>
            }
          />

          <Route
            path="/student/tests/:testId/instructions"
            element={
              <RoleRoute allowedRole="STUDENT">
                <TestInstructions />
              </RoleRoute>
            }
          />

          <Route
            path="/student/attempts/:attemptId"
            element={
              <RoleRoute allowedRole="STUDENT">
                <TestAttempt />
              </RoleRoute>
            }
          />

          <Route
            path="/student/attempts/:attemptId/result"
            element={
              <RoleRoute allowedRole="STUDENT">
                <TestResult />
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
            path="/admin/tests"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminTests />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/tests/create"
            element={
              <RoleRoute allowedRole="ADMIN">
                <CreateTest />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/tests/:testId/questions"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AddQuestions />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/tests/:testId/attempts"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminTestAttempts />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminReports />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/reports/results/:attemptId"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminResultDetail />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminStudents />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/students/:studentId"
            element={
              <RoleRoute allowedRole="ADMIN">
                <AdminStudentDetail />
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
    </>
  );
}

export default App;
