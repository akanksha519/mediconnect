import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function DoctorList() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [city,    setCity]    = useState("");
  const [spec,    setSpec]    = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const specFromUrl = params.get("specialization");
    if (specFromUrl) {
      setSpec(specFromUrl);
      fetchDoctors(specFromUrl);
    } else {
      fetchDoctors();
    }
  }, []);

  const fetchDoctors = async (overrideSpec) => {
    try {
      setLoading(true);
      const params = {};
      if (city) params.city = city;
      if (overrideSpec || spec) params.specialization = overrideSpec || spec;
      if (search) params.search = search;
      const res = await axios.get(`${API}/doctors`, { params });
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Navbar */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>MediConnect</span>
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          {user ? (
            <Link to="/dashboard" style={{ padding: "8px 16px", background: "#2563eb", color: "white", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" style={{ padding: "8px 16px", background: "#2563eb", color: "white", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Find Doctors</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Search from our verified specialists</p>

        {/* Search / Filter */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            style={{ flex: 2, minWidth: 180, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City..."
            style={{ flex: 1, minWidth: 120, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
          <input
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            placeholder="Specialization..."
            style={{ flex: 1, minWidth: 150, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
          <button type="submit" style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Search
          </button>
        </form>

        {/* Doctors Grid */}
        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 48 }}>👨‍⚕️</p>
            <p style={{ fontSize: 18, fontWeight: 600, marginTop: 16 }}>No doctors found</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {doctors.map((doc) => (
              <div key={doc._id} style={{ background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                    👨‍⚕️
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16 }}> {doc.user?.name}</p>
                    <p style={{ color: "#2563eb", fontSize: 13, fontWeight: 500 }}>{doc.specialization}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  <p style={{ color: "#6b7280", fontSize: 13 }}>🏥 {doc.hospital}</p>
                  <p style={{ color: "#6b7280", fontSize: 13 }}>📍 {doc.city}</p>
                  <p style={{ color: "#6b7280", fontSize: 13 }}>⏳ {doc.experience} years experience</p>
                  <p style={{ color: "#6b7280", fontSize: 13 }}>💰 ₹{doc.consultationFee} consultation fee</p>
                </div>
                <button
                  onClick={() => user ? navigate(`/book/${doc._id}`) : navigate("/login")}
                  style={{ width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}