import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaCommentDots,
  FaSignOutAlt,
  FaHome,
  FaChartPie,
  FaBolt,
} from "react-icons/fa";

import AdminTrackComplaints from "./AdminTrackComplaints.jsx";
import AdminFeedback from "../../Feedback/AdminFeedback.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import SLAAnalysis from "./SLAAnalysis.jsx"; // ✅ Correct name

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [admin, setAdmin] = useState(null);

  // ✅ Fetch and auto-refresh complaints when data changes anywhere
  useEffect(() => {
    const loadComplaints = () => {
      const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
      setComplaints(stored);
    };

    loadComplaints();
    window.addEventListener("complaintsUpdated", loadComplaints);
    window.addEventListener("storage", loadComplaints);

    const loggedAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    if (loggedAdmin) setAdmin(loggedAdmin);

    return () => {
      window.removeEventListener("complaintsUpdated", loadComplaints);
      window.removeEventListener("storage", loadComplaints);
    };
  }, []);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Closed").length;
  const pending = complaints.filter((c) => c.status !== "Closed").length;

  const handleLogout = () => {
    localStorage.removeItem("loggedInAdmin");
    window.location.href = "/loginselection";
  };

  const renderSection = () => {
    switch (activeSection) {
      case "track":
        return <AdminTrackComplaints />;
      case "feedback":
        return <AdminFeedback />;
      case "analytics":
        return <AdminAnalytics />;
      case "sle":
        return <SLAAnalysis complaints={complaints} />; // ✅ Pass updated data
      default:
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome {admin?.name || "Admin"} 👋
            </h1>

            <div className="cards-container">
              <div className="card neon">
                <FaUsers className="icon" />
                <h3>Total Complaints</h3>
                <p>{total}</p>
              </div>
              <div className="card neon">
                <FaClipboardList className="icon" />
                <h3>Pending</h3>
                <p>{pending}</p>
              </div>
              <div className="card neon">
                <FaUsers className="icon" />
                <h3>Resolved</h3>
                <p>{resolved}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li
            onClick={() => setActiveSection("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            <FaHome /> Dashboard
          </li>

          <li
            onClick={() => setActiveSection("track")}
            className={activeSection === "track" ? "active" : ""}
          >
            <FaClipboardList /> Track Complaints
          </li>

          <li
            onClick={() => setActiveSection("feedback")}
            className={activeSection === "feedback" ? "active" : ""}
          >
            <FaCommentDots /> View Feedbacks
          </li>

          <li
            onClick={() => setActiveSection("analytics")}
            className={activeSection === "analytics" ? "active" : ""}
          >
            <FaChartPie /> Analytics
          </li>

          <li
            onClick={() => setActiveSection("sle")}
            className={activeSection === "sle" ? "active" : ""}
          >
            <FaBolt /> SLA Analysis
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">{renderSection()}</main>

      {/* Styles */}
      <style jsx="true">{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          background: radial-gradient(circle at center, #05080c 40%, #010203 100%);
          color: #fff;
          font-family: "Poppins", sans-serif;
        }

        .sidebar {
          width: 240px;
          background: rgba(10, 15, 20, 0.9);
          border-right: 2px solid #00eaff55;
          box-shadow: inset 0 0 25px #00eaff33, 0 0 20px #00eaff22;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
        }

        .sidebar-title {
          font-size: 1.5rem;
          text-align: center;
          color: #00eaff;
          margin-bottom: 30px;
          text-shadow: 0 0 10px #00eaff;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
        }

        .sidebar-menu li {
          padding: 12px 10px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
        }

        .sidebar-menu li:hover,
        .sidebar-menu li.active {
          color: #00eaff;
          background: rgba(0, 234, 255, 0.1);
          transform: translateX(5px);
          box-shadow: 0 0 10px #00eaff33;
        }

        .logout-btn {
          background: linear-gradient(90deg, #ff4444, #cc0000);
          border: none;
          color: #fff;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .logout-btn:hover {
          background: linear-gradient(90deg, #ff6666, #ff0000);
          box-shadow: 0 0 20px #ff3333aa;
          transform: scale(1.05);
        }

        .main-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .welcome-title {
          font-size: 2.5rem;
          text-align: center;
          color: #00eaff;
          text-shadow: 0 0 15px #00eaff;
          margin-bottom: 40px;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .card {
          flex: 1;
          min-width: 220px;
          max-width: 280px;
          background: rgba(20, 25, 35, 0.85);
          border-radius: 15px;
          text-align: center;
          padding: 25px;
          transition: all 0.3s ease;
        }

        .card.neon {
          box-shadow: 0 0 15px #00eaff33, 0 0 30px #00eaff22;
          border: 1px solid #00eaff44;
          animation: glowPulse 3s infinite ease-in-out;
        }

        .card.neon:hover {
          box-shadow: 0 0 25px #00eaffaa, 0 0 50px #00eaff66;
          transform: translateY(-5px);
        }

        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 10px #00eaff33, 0 0 20px #00eaff22;
          }
          50% {
            box-shadow: 0 0 25px #00eaffaa, 0 0 45px #00eaff66;
          }
          100% {
            box-shadow: 0 0 10px #00eaff33, 0 0 20px #00eaff22;
          }
        }

        .icon {
          font-size: 2rem;
          color: #00eaff;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
