// src/components/Auth/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Initialize default admins only once
  useEffect(() => {
    let admins = JSON.parse(localStorage.getItem("admins") || "[]");
    if (admins.length === 0) {
      admins = [
        { email: "admin@civic.com", password: "admin123", name: "Super Admin" },
        { email: "manager@civic.com", password: "manager123", name: "Manager" },
        { email: "support@civic.com", password: "support123", name: "Support Admin" }
      ];
      localStorage.setItem("admins", JSON.stringify(admins));
    }

    // Auto-redirect if already logged in
    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    if (loggedInAdmin) navigate("/admin-dashboard");
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");

    const user = admins.find(
      (a) =>
        a.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        a.password === password
    );

    if (user) {
      localStorage.setItem("loggedInAdmin", JSON.stringify(user));
      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin credentials!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#2b6ce4", textAlign: "center", marginBottom: "30px" }}>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc", width: "100%", marginBottom: "20px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc", width: "100%", marginBottom: "20px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "none", background: "#2b6ce4", color: "#fff", fontWeight: "600", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}
