// src/components/Dashboards/DepartmentDashboard/Sidebar.jsx
import React from "react";
import { FaTasks, FaCheckCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { departments } from "../../Data/department";

export default function Sidebar({ setLoggedDept, activeSection, setActiveSection, loggedDept }) {
  const liStyle = {
    margin: "10px 0",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "8px",
    transition: "0.2s",
  };

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Departments</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {departments.map((dept) => (
          <li
            key={dept.id}
            style={liStyle}
            onClick={() => setLoggedDept(dept)}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#34495e")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {dept.name}
          </li>
        ))}
      </ul>

      {loggedDept && (
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => setActiveSection("welcome")}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: activeSection === "welcome" ? "#3498db" : "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <FaTasks style={{ marginRight: "10px" }} /> Dashboard
          </button>

          <button
            onClick={() => setActiveSection("tracking")}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: activeSection === "tracking" ? "#3498db" : "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <FaTasks style={{ marginRight: "10px" }} /> Complaint Tracking
          </button>

          <button
            onClick={() => setActiveSection("profile")}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: activeSection === "profile" ? "#3498db" : "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <FaUser style={{ marginRight: "10px" }} /> Profile
          </button>

          <button
            onClick={() => setLoggedDept(null)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#e74c3c",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <FaSignOutAlt style={{ marginRight: "10px" }} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
