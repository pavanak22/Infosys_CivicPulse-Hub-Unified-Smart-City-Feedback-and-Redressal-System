import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmitComplaint from "./SubmitComplaint";
import ComplaintTracking from "./ComplaintTracking";
import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineForm,
  AiOutlineLogout,
} from "react-icons/ai";

// 🔹 Backend integration
import { submitComplaint } from "../../../api.js";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) navigate("user-login"); // ✅ GitHub Pages friendly
    else setLoggedInUser(user);

    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    setFeedbacks(storedFeedbacks);
  }, [navigate]);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("user-login", { replace: true });
  };

  // ✅ Complaint submission handler (backend + event trigger)
  const handleComplaintSubmit = async (complaintData) => {
    try {
      await submitComplaint({
        ...complaintData,
        raisedBy: loggedInUser?.email,
      });

      alert("Complaint submitted successfully!");

      // 🔄 Dispatch global refresh event — Admin & Department auto-refresh
      window.dispatchEvent(
        new CustomEvent("app:refresh", { detail: { refreshComplaints: true } })
      );
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again later.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {loggedInUser?.name || "User"} 👋
            </h1>
            <p className="welcome-text">
              Submit complaints, track progress, and manage your profile easily.
            </p>
          </div>
        );

      case "submit":
        return (
          <SubmitComplaint
            loggedInUser={loggedInUser}
            onSubmitComplaint={handleComplaintSubmit}
          />
        );

      case "track":
        return (
          <div className="tracking-wrapper">
            <ComplaintTracking
              feedbacks={feedbacks}
              setFeedbacks={setFeedbacks}
            />
          </div>
        );

      case "profile":
        return (
          <div className="profile-card">
            <h2>Your Profile</h2>
            <p>
              <strong>Name:</strong> {loggedInUser?.name}
            </p>
            <p>
              <strong>Email:</strong> {loggedInUser?.email}
            </p>
            <p>
              <strong>Role:</strong> Citizen
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <h2 className="sidebar-title">Civic Hub</h2>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            <AiOutlineHome /> Home
          </li>
          <li
            className={activeTab === "submit" ? "active" : ""}
            onClick={() => setActiveTab("submit")}
          >
            <AiOutlineForm /> Submit Complaint
          </li>
          <li
            className={activeTab === "track" ? "active" : ""}
            onClick={() => setActiveTab("track")}
          >
            <AiOutlineFileText /> Track Complaints
          </li>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <AiOutlineUser /> Profile
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <AiOutlineLogout /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="user-main">{renderContent()}</main>

      {/* === Styles === */}
      <style jsx="true">{`
        .user-dashboard {
          display: flex;
          height: 100vh;
          background: radial-gradient(circle at center, #05080c 40%, #010203 100%);
          color: #fff;
          font-family: "Poppins", sans-serif;
        }

        .user-sidebar {
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
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          color: #ccc;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .sidebar-menu li:hover,
        .sidebar-menu li.active {
          color: #00eaff;
          background: rgba(0, 234, 255, 0.1);
          transform: translateX(5px);
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

        .user-main {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .welcome-section {
          text-align: center;
          margin-top: 100px;
        }

        .welcome-title {
          font-size: 2.5rem;
          color: #00eaff;
          text-shadow: 0 0 15px #00eaff;
          margin-bottom: 20px;
        }

        .welcome-text {
          font-size: 1.1rem;
          color: #bbb;
        }

        .tracking-wrapper {
          background: rgba(20, 25, 35, 0.8);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 0 20px #00eaff33;
        }

        .profile-card {
          background: rgba(20, 25, 35, 0.85);
          border-radius: 15px;
          padding: 30px;
          text-align: left;
          width: 400px;
          margin: 50px auto;
          border: 1px solid #00eaff44;
          box-shadow: 0 0 25px #00eaff33;
          animation: glowPulse 3s infinite ease-in-out;
        }

        .profile-card h2 {
          color: #00eaff;
          text-align: center;
          margin-bottom: 20px;
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
      `}</style>
    </div>
  );
}
