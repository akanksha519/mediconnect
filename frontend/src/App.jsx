import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home             from "./pages/Home";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import DoctorList       from "./pages/DoctorList";
import BookAppointment  from "./pages/BookAppointment";
import DoctorSetup      from "./pages/DoctorSetup";
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import DoctorDashboard  from "./pages/dashboard/DoctorDashboard";
import AdminDashboard   from "./pages/dashboard/AdminDashboard";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const Dashboard = () => {
  const { user } = useAuth();
  if (user?.role === "doctor") return <DoctorDashboard />;
  if (user?.role === "admin")  return <AdminDashboard />;
  return <PatientDashboard />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"         element={<Home />} />
      <Route path="/doctors"  element={<DoctorList />} />
      <Route path="/login"    element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      <Route path="/doctor-setup" element={
        <ProtectedRoute roles={["doctor"]}>
          <DoctorSetup />
        </ProtectedRoute>
      } />

      <Route path="/book/:doctorId" element={
        <ProtectedRoute roles={["patient"]}>
          <BookAppointment />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}