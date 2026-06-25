import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookAppointment() {
  const { doctorId }          = useParams();
  const navigate              = useNavigate();
  const [doctor,  setDoctor]  = useState(null);
  const [slots,   setSlots]   = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason,  setReason]  = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/doctors/${doctorId}`),
      axios.get(`${API}/doctors/${doctorId}/slots`),
    ]).then(([docRes, slotsRes]) => {
      setDoctor(docRes.data.doctor);
      setSlots(slotsRes.data.slots);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleBook = async () => {
    if (!selectedSlot) return setError("Please select a time slot");
    if (!reason.trim()) return setError("Please enter reason for visit");

    try {
      setBooking(true);
      setError("");

      // Step 1 — Book the appointment
      const aptRes = await axios.post(`${API}/appointments`, {
        doctorId,
        slotId: selectedSlot,
        reason,
      });

      const appointment = aptRes.data.appointment;

      // Step 2 — Create simulated order
      const orderRes = await axios.post(`${API}/payments/create-order`, {
        appointmentId: appointment._id,
      });

      // Step 3 — Verify simulated payment directly
      await axios.post(`${API}/payments/verify`, {
        appointmentId: appointment._id,
        simulated: true,
      });

      alert("Payment successful! Appointment confirmed.");
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Try again.");
      setBooking(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!doctor) return <div style={{ padding: 40, textAlign: "center" }}>Doctor not found</div>;

  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      <nav style={{ background: "white", padding: "16px 40px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <span style={{ fontSize: 24 }}>🏥</span>
        <span style={{ fontWeight: 700, fontSize: 18 }}>MediConnect</span>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>

        {/* Doctor Info */}
        <div style={{ background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
              👨‍⚕️
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}> {doctor.user?.name}</h2>
              <p style={{ color: "#2563eb", fontWeight: 500 }}>{doctor.specialization}</p>
              <p style={{ color: "#6b7280", fontSize: 13 }}>🏥 {doctor.hospital} • 📍 {doctor.city}</p>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#eff6ff", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#2563eb", fontWeight: 600 }}>Consultation Fee</p>
            <p style={{ color: "#2563eb", fontWeight: 700, fontSize: 18 }}>₹{doctor.consultationFee}</p>
          </div>
        </div>

        {/* Slot Selection */}
        <div style={{ background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Select a Time Slot</h3>
          {slots.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No available slots for this doctor.</p>
          ) : (
            Object.entries(slotsByDate).map(([date, dateSlots]) => (
              <div key={date} style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: 600, marginBottom: 10 }}>📅 {date}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {dateSlots.map((slot) => (
                    <div
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot._id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: `1.5px solid ${selectedSlot === slot._id ? "#2563eb" : "#e5e7eb"}`,
                        background: selectedSlot === slot._id ? "#eff6ff" : "white",
                        color: selectedSlot === slot._id ? "#2563eb" : "#374151",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reason */}
        <div style={{ background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Reason for Visit</h3>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(""); }}
            placeholder="Describe your symptoms or reason for visit..."
            rows={4}
            style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {error && (
          <div style={{ padding: "10px 14px", background: "#fef2f2", color: "#dc2626", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={booking}
          style={{ width: "100%", padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: booking ? "not-allowed" : "pointer", opacity: booking ? 0.7 : 1 }}
        >
          {booking ? "Processing..." : `Pay ₹${doctor.consultationFee} & Confirm`}
        </button>

      </div>
    </div>
  );
}