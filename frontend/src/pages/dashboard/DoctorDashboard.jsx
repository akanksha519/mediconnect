import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API = "https://mediconnect-backend-4vgp.onrender.com/api";
export default function DoctorDashboard() {
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState("appointments");
  const [slotForm, setSlotForm]         = useState({ date: "", startTime: "", endTime: "" });
  const [addingSlot, setAddingSlot]     = useState(false);
  const [slotMsg, setSlotMsg]           = useState("");

  useEffect(() => {
    axios.get(`${API}/doctors/my-profile`)
      .then(res => {
        if (!res.data.doctor) {
          navigate("/doctor-setup");
          return;
        }
        return axios.get(`${API}/appointments/my`);
      })
      .then(res => {
        if (res) setAppointments(res.data.appointments);
      })
      .catch(() => navigate("/doctor-setup"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(`${API}/appointments/${id}/confirm`);
      setAppointments(appointments.map(a =>
        a._id === id ? { ...a, status: "confirmed" } : a
      ));
    } catch (err) {
      alert(err.response?.data?.message || "Error confirming appointment");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`${API}/appointments/${id}/complete`);
      setAppointments(appointments.map(a =>
        a._id === id ? { ...a, status: "completed" } : a
      ));
    } catch (err) {
      alert(err.response?.data?.message || "Error completing appointment");
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotForm.date || !slotForm.startTime || !slotForm.endTime) {
      return setSlotMsg("Please fill all slot fields");
    }
    try {
      setAddingSlot(true);
      await axios.post(`${API}/doctors/slots`, {
        slots: [slotForm],
      });
      setSlotMsg("Slot added successfully!");
      setSlotForm({ date: "", startTime: "", endTime: "" });
    } catch (err) {
      setSlotMsg(err.response?.data?.message || "Error adding slot");
    } finally {
      setAddingSlot(false);
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

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Navbar */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <span style={{ fontWeight: 700, fontSize: 18 }}>MediConnect</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#6b7280", fontSize: 14 }}>👨‍⚕️ {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", color: "#6b7280", fontSize: 14 }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button style={tabStyle(tab === "appointments")} onClick={() => setTab("appointments")}>
            My Appointments
          </button>
          <button style={tabStyle(tab === "slots")} onClick={() => setTab("slots")}>
            Manage Slots
          </button>
        </div>

        {/* Appointments Tab */}
        {tab === "appointments" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>My Schedule</h1>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>Manage your appointments</p>

            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading...</p>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 12 }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
                <p style={{ fontSize: 18, fontWeight: 600 }}>No appointments yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {appointments.map((apt) => (
                  <div key={apt._id} style={{ background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{apt.patient?.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 4 }}>📞 {apt.patient?.phone} • {apt.patient?.email}</p>
                      <p style={{ color: "#6b7280", fontSize: 14 }}>📅 {apt.slot?.date} ⏰ {apt.slot?.startTime} - {apt.slot?.endTime}</p>
                      {apt.reason && <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Reason: {apt.reason}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: `${statusColor[apt.status]}20`, color: statusColor[apt.status] }}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                      <div style={{ display: "flex", gap: 8 }}>
                        {apt.status === "pending" && (
                          <button onClick={() => handleConfirm(apt._id)}
                            style={{ padding: "6px 14px", background: "#16a34a", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Confirm
                          </button>
                        )}
                        {apt.status === "confirmed" && (
                          <button onClick={() => handleComplete(apt._id)}
                            style={{ padding: "6px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Slots Tab */}
        {tab === "slots" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Manage Slots</h1>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>Add your available time slots for patients to book</p>

            <div style={{ background: "white", borderRadius: 12, padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Add New Slot</h3>

              <form onSubmit={handleAddSlot} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Date</label>
                  <input
                    type="date"
                    value={slotForm.date}
                    onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                    style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Start Time</label>
                  <input
                    type="time"
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>End Time</label>
                  <input
                    type="time"
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingSlot}
                  style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                >
                  {addingSlot ? "Adding..." : "+ Add Slot"}
                </button>
              </form>

              {slotMsg && (
                <p style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: slotMsg.includes("success") ? "#16a34a" : "#dc2626" }}>
                  {slotMsg}
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}