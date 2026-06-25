import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API = "https://mediconnect-backend-4vgp.onrender.com/api";
export default function AdminDashboard() {
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors]       = useState([]);
  const [tab, setTab]               = useState("doctors");
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/appointments`),
      axios.get(`${API}/doctors/all`),
    ]).then(([aptsRes, docsRes]) => {
      setAppointments(aptsRes.data.appointments);
      setDoctors(docsRes.data.doctors);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleApprove = async (doctorId) => {
    try {
      await axios.put(`${API}/doctors/${doctorId}/approve`);
      setDoctors(doctors.map(d =>
        d._id === doctorId ? { ...d, isApproved: true } : d
      ));
      alert("Doctor approved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error approving doctor");
    }
  };

  const statusColor = {
    pending:   "#d97706",
    confirmed: "#16a34a",
    cancelled: "#dc2626",
    completed: "#2563eb",
  };

  const tabStyle = (active) => ({
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    background: active ? "#2563eb" : "white",
    color: active ? "white" : "#6b7280",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  });

  const pendingDoctors   = doctors.filter(d => !d.isApproved);
  const approvedDoctors  = doctors.filter(d => d.isApproved);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Navbar */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <span style={{ fontWeight: 700, fontSize: 18 }}>MediConnect Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#6b7280", fontSize: 14 }}>🛡️ {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", color: "#6b7280", fontSize: 14 }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { label: "Total Appointments", value: appointments.length,  icon: "📅" },
            { label: "Total Doctors",      value: approvedDoctors.length, icon: "👨‍⚕️" },
            { label: "Pending Approvals",  value: pendingDoctors.length,  icon: "⏳" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", flex: 1, minWidth: 180 }}>
              <p style={{ fontSize: 28, marginBottom: 4 }}>{stat.icon}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{stat.value}</p>
              <p style={{ color: "#6b7280", fontSize: 13 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button style={tabStyle(tab === "doctors")} onClick={() => setTab("doctors")}>
            Doctors {pendingDoctors.length > 0 && `(${pendingDoctors.length} pending)`}
          </button>
          <button style={tabStyle(tab === "appointments")} onClick={() => setTab("appointments")}>
            Appointments
          </button>
        </div>

        {loading ? <p style={{ color: "#6b7280" }}>Loading...</p> : (
          tab === "doctors" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Pending doctors first */}
              {pendingDoctors.length > 0 && (
                <>
                  <p style={{ fontWeight: 600, color: "#d97706", fontSize: 14, marginBottom: 4 }}>
                    ⏳ Pending Approval ({pendingDoctors.length})
                  </p>
                  {pendingDoctors.map((doc) => (
                    <div key={doc._id} style={{ background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, border: "1.5px solid #fde68a" }}>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: 4 }}>{doc.user?.name}</p>
                        <p style={{ color: "#6b7280", fontSize: 13 }}>{doc.specialization} • {doc.hospital} • {doc.city}</p>
                        <p style={{ color: "#6b7280", fontSize: 13 }}>📞 {doc.user?.phone} • ✉️ {doc.user?.email}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: "#fef9c3", color: "#d97706" }}>
                          Pending
                        </span>
                        <button
                          onClick={() => handleApprove(doc._id)}
                          style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                        >
                          ✓ Approve
                        </button>
                      </div>
                    </div>
                  ))}
                  <div style={{ height: 8 }} />
                </>
              )}

              {/* Approved doctors */}
              <p style={{ fontWeight: 600, color: "#16a34a", fontSize: 14, marginBottom: 4 }}>
                ✅ Approved Doctors ({approvedDoctors.length})
              </p>
              {approvedDoctors.map((doc) => (
                <div key={doc._id} style={{ background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{doc.user?.name}</p>
                    <p style={{ color: "#6b7280", fontSize: 13 }}>{doc.specialization} • {doc.hospital} • {doc.city}</p>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: "#dcfce7", color: "#16a34a" }}>
                    Approved
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {appointments.length === 0 ? (
                <p style={{ color: "#6b7280" }}>No appointments yet.</p>
              ) : appointments.map((apt) => (
                <div key={apt._id} style={{ background: "white", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{apt.patient?.name} → {apt.doctor?.user?.name}</p>
                    <p style={{ color: "#6b7280", fontSize: 13 }}>📅 {apt.slot?.date} ⏰ {apt.slot?.startTime}</p>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: `${statusColor[apt.status]}20`, color: statusColor[apt.status] }}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}