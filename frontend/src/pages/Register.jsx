import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Register() {
  const navigate     = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "", role: "patient",
  });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())      newErrors.name     = "Name is required";
    if (!form.email.trim())     newErrors.email    = "Email is required";
    if (!form.phone.trim())     newErrors.phone    = "Phone is required";
    if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (form.password !== form.confirm) newErrors.confirm = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    try {
      setLoading(true);
      await register({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, role: form.role,
      });
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🏥</div>
          <span className={styles.logoText}>MediConnect</span>
        </div>

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join as a patient or doctor</p>

        {apiError && (
          <div className={`${styles.alert} ${styles.alertError}`}>{apiError}</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>I am a</label>
            <div className={styles.roleGroup}>
              <div
                className={`${styles.roleOption} ${form.role === "patient" ? styles.active : ""}`}
                onClick={() => setForm({ ...form, role: "patient" })}
              >
                🧑‍🤝‍🧑 Patient
              </div>
              <div
                className={`${styles.roleOption} ${form.role === "doctor" ? styles.active : ""}`}
                onClick={() => setForm({ ...form, role: "doctor" })}
              >
                👨‍⚕️ Doctor
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full name</label>
            <input className={`${styles.input} ${errors.name ? styles.error : ""}`}
              type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="John Doe" />
            {errors.name && <span className={styles.inputError}>{errors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email address</label>
            <input className={`${styles.input} ${errors.email ? styles.error : ""}`}
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <span className={styles.inputError}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone number</label>
            <input className={`${styles.input} ${errors.phone ? styles.error : ""}`}
              type="tel" name="phone" value={form.phone}
              onChange={handleChange} placeholder="+91 98765 43210" />
            {errors.phone && <span className={styles.inputError}>{errors.phone}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <input className={`${styles.input} ${errors.password ? styles.error : ""}`}
              type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Min. 6 characters" />
            {errors.password && <span className={styles.inputError}>{errors.password}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Confirm password</label>
            <input className={`${styles.input} ${errors.confirm ? styles.error : ""}`}
              type="password" name="confirm" value={form.confirm}
              onChange={handleChange} placeholder="Repeat your password" />
            {errors.confirm && <span className={styles.inputError}>{errors.confirm}</span>}
          </div>

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}