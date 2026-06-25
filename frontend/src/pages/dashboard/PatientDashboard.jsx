import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API = "https://mediconnect-backend-4vgp.onrender.com/api";
export default function PatientDashboard() {
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    axios.get(`${API}/appointments/my`)
      .then(res => setAppointments(res.data.appointments))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const statusColor = {
    pending:   "#d97706",
    confirmed: "#16a34a",
    cancelled: "#dc2626",
    completed: "#2563eb",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Navbar */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <span style={{ fontWeight: 700, fontSize: 18 }}>MediConnect</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#6b7280", fontSize: 14 }}>👋 {user?.name}</span>
          <Link to="/doctors" style={{ padding: "8px 16px", background: "#2563eb", color: "white", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Book Appointment
          </Link>
          <button onClick={handleLogout} style={{ padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", color: "#6b7280", fontSize: 14 }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>My Appointments</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Track and manage your appointments</p>

        {/* Appointments List */}
        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📅</p>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No appointments yet</p>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>Book your first appointment with a doctor</p>
            <Link to="/doctors" style={{ padding: "12px 24px", background: "#2563eb", color: "white", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
              Find Doctors
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {appointments.map((apt) => (
              <div key={apt._id} style={{ background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                     {apt.doctor?.user?.name}
                  </p>
                  <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 4 }}>
                    {apt.doctor?.specialization} • {apt.doctor?.hospital}
                  </p>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    📅 {apt.slot?.date} ⏰ {apt.slot?.startTime} - {apt.slot?.endTime}
                  </p>
                  {apt.reason && <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Reason: {apt.reason}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: `${statusColor[apt.status]}20`, color: statusColor[apt.status] }}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                  <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>
                    💳 {apt.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}