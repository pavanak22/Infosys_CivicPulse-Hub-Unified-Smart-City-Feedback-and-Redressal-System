import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus, FaUserShield, FaBuilding } from "react-icons/fa";
import "../../App.css"; // global styles

export default function LoginSelection() {
  const navigate = useNavigate();

  const buttons = [
    { label: "User Register", path: "/register", icon: <FaUserPlus /> },
    { label: "User Login", path: "/user-login", icon: <FaUser /> },
    { label: "Admin Login", path: "/admin-login", icon: <FaUserShield /> },
    { label: "Department Login", path: "/department-login", icon: <FaBuilding /> },
  ];

  return (
    <div
      className="page-container"
      style={{
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eef2ff, #f5f5f5)",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        minHeight: "100vh",
        overflowY: "auto", // ✅ allows scrolling up/down
        padding: "60px 20px", // ✅ adds breathing room top/bottom
      }}
    >
      {/* Subtle animated circles */}
      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(78, 142, 247, 0.15)",
          top: "-40px",
          left: "-40px",
          animation: "float 6s ease-in-out infinite alternate",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(43, 108, 228, 0.1)",
          bottom: "-90px",
          right: "-90px",
          animation: "float 8s ease-in-out infinite alternate-reverse",
        }}
      ></div>

      <div
        className="card-container"
        style={{
          backgroundColor: "#fff",
          padding: "50px 40px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          textAlign: "center",
          width: "420px",
          zIndex: 1,
          margin: "auto", // ✅ keeps it centered even with scroll
        }}
      >
        {/* App header */}
        <div style={{ marginBottom: "25px" }}>
          <h1 style={{ color: "#2b6ce4", marginBottom: "5px" }}>CivicPulse Hub</h1>
          <p style={{ color: "#555", fontSize: "1rem" }}>
            Unified Smart City Feedback & Redressal System
          </p>
        </div>

        <h2 style={{ color: "#333", marginBottom: "20px", fontWeight: 600 }}>
          Select Login Type
        </h2>
        <p style={{ marginBottom: "30px", color: "#666", fontSize: "0.95rem" }}>
          Choose the account type to continue.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {buttons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "14px 22px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(90deg, #4e8ef7, #2b6ce4)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "0.3s all",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = 0.9;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = 1;
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
