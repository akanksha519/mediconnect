import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://mediconnect-backend-4vgp.onrender.com/api";
export default function DoctorSetup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    specialization:  "",
    experience:      "",
    qualifications:  "",
    consultationFee: "",
    about:           "",
    hospital:        "",
    city:            "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.specialization || !form.experience || !form.consultationFee || !form.hospital || !form.city) {
      return setError("Please fill all required fields");
    }
    try {
      setLoading(true);
      await axios.post(`${API}/doctors/profile`, {
        ...form,
        experience:      Number(form.experience),
        consultationFee: Number(form.consultationFee),
        qualifications:  form.qualifications.split(",").map(q => q.trim()).filter(Boolean),
      });
      alert("Profile created! An admin will approve your profile shortly.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Navbar */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <span style={{ fontSize: 24 }}>🏥</span>
        <span style={{ fontWeight: 700, fontSize: 18 }}>MediConnect</span>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Complete Your Profile</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Fill in your medical details so patients can find you</p>

        {error && (
          <div style={{ padding: "10px 14px", background: "#fef2f2", color: "#dc2626", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Specialization */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Specialization *</label>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist, Dermatologist"
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>

          {/* Experience */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Years of Experience *</label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 5"
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>

          {/* Qualifications */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Qualifications (comma separated)</label>
            <input
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD, DM"
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>

          {/* Consultation Fee */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Consultation Fee (₹) *</label>
            <input
              name="consultationFee"
              value={form.consultationFee}
              onChange={handleChange}
              type="number"
              placeholder="e.g. 500"
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>

          {/* Hospital */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Hospital / Clinic Name *</label>
            <input
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              placeholder="e.g. Apollo Hospital"
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>

          {/* City */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>City *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Hyderabad"
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>

          {/* About */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>About You</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="Brief description about your expertise and experience..."
              rows={4}
              style={{ padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 8 }}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}