import { Link } from "react-router-dom";

const specializations = [
  { icon: "❤️", name: "Cardiologist" },
  { icon: "🧠", name: "Neurologist" },
  { icon: "🦷", name: "Dentist" },
  { icon: "👁️", name: "Ophthalmologist" },
  { icon: "🦴", name: "Orthopedic" },
  { icon: "🧬", name: "Dermatologist" },
  { icon: "👶", name: "Pediatrician" },
  { icon: "🩺", name: "General Physician" },
  { icon: "👂", name: "ENT" },
  { icon: "🫁", name: "Pulmonologist" },
  { icon: "🤰", name: "Gynecologist" }
];

const steps = [
  { num: "01", title: "Create Account", desc: "Register as a patient in just 2 minutes" },
  { num: "02", title: "Find a Doctor", desc: "Search by specialization, city or name" },
  { num: "03", title: "Book & Pay", desc: "Select a slot and pay consultation fee online" },
  { num: "04", title: "Get Treated", desc: "Visit the doctor at your scheduled time" },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 60px", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🏥</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#111827" }}>MediConnect</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/doctors" style={{ color: "#6b7280", fontWeight: 500, textDecoration: "none", fontSize: 15 }}>Find Doctors</Link>
          <Link to="/login" style={{ padding: "8px 20px", border: "1.5px solid #2563eb", borderRadius: 8, color: "#2563eb", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
            Sign in
          </Link>
          <Link to="/register" style={{ padding: "8px 20px", background: "#2563eb", borderRadius: 8, color: "white", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)", padding: "90px 60px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#dbeafe", color: "#2563eb", padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          🇮🇳 Trusted by patients across India
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, color: "#111827", marginBottom: 20, lineHeight: 1.15 }}>
          Book Doctor Appointments <br />
          <span style={{ color: "#2563eb" }}>Instantly Online</span>
        </h1>
        <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
          Connect with top verified doctors, book appointments in seconds, and manage your health — all in one place.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" style={{ padding: "14px 36px", background: "#2563eb", color: "white", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
            Book Appointment →
          </Link>
          <Link to="/doctors" style={{ padding: "14px 36px", border: "1.5px solid #2563eb", color: "#2563eb", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
            View Doctors
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[
            { value: "500+", label: "Doctors" },
            { value: "10K+", label: "Patients" },
            { value: "50+", label: "Specializations" },
            { value: "4.8★", label: "Rating" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#2563eb" }}>{s.value}</p>
              <p style={{ color: "#6b7280", fontSize: 14, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Specializations */}
      <div style={{ padding: "70px 60px", background: "white", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Find by Specialization</h2>
        <p style={{ color: "#6b7280", marginBottom: 40 }}>Browse doctors across all major medical specialties</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {specializations.map(s => (
            <Link to={`/doctors?specialization=${s.name}`} key={s.name} style={{ textDecoration: "none" }}>              <div style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "20px 24px", minWidth: 130, textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
              >
                <p style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{s.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "70px 60px", background: "#f9fafb", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>How It Works</h2>
        <p style={{ color: "#6b7280", marginBottom: 50 }}>Get started in 4 simple steps</p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", maxWidth: 1000, margin: "0 auto" }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{ background: "white", borderRadius: 12, padding: "32px 24px", maxWidth: 220, flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#2563eb", fontWeight: 800, fontSize: 16 }}>
                {step.num}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: "#6b7280", fontSize: 14 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "70px 60px", background: "white" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Why Choose MediConnect?</h2>
            <p style={{ color: "#6b7280", marginBottom: 32, lineHeight: 1.8 }}>
              We make healthcare accessible and convenient for everyone. Book appointments with verified doctors, pay securely online, and get real-time updates.
            </p>
            {[
              "✅ Verified & approved doctors only",
              "✅ Secure online payments",
              "✅ Real-time appointment notifications",
              "✅ Easy cancellation & rescheduling",
              "✅ Available 24/7",
            ].map(f => (
              <p key={f} style={{ color: "#374151", fontSize: 15, marginBottom: 12, fontWeight: 500 }}>{f}</p>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 280, background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", borderRadius: 16, padding: "40px", textAlign: "center" }}>
            <p style={{ fontSize: 80, marginBottom: 16 }}>🏥</p>
            <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your Health, Our Priority</p>
            <p style={{ color: "#6b7280", fontSize: 15 }}>Join thousands of patients who trust MediConnect for their healthcare needs</p>
            <Link to="/register" style={{ display: "inline-block", marginTop: 24, padding: "12px 28px", background: "#2563eb", color: "white", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#111827", color: "white", padding: "40px 60px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>MediConnect</span>
        </div>
        <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16 }}>
          Making healthcare accessible for everyone
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/doctors" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>Find Doctors</Link>
          <Link to="/register" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>Register</Link>
          <Link to="/login" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>Sign In</Link>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 24 }}>© 2026 MediConnect. Built with MERN Stack.</p>
      </footer>

    </div>
  );
}