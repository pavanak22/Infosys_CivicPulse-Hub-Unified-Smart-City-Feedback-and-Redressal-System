import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaClipboardList,
  FaBuilding,
  FaSignOutAlt,
  FaUsers,
  FaCheckCircle,
  FaCommentDots,
} from "react-icons/fa";
import { departments as deptData } from "../../Data/department.js";
import DeptComplaintTracking from "./DeptComplaintTracking.jsx";
import DepartmentFeedback from "../../Feedback/DepartmentFeedback.jsx";
import DepartmentDetails from "./DepartmentDetails.jsx";

// 🔹 Backend API imports (correct relative path from this file)
import {
  getAllComplaints,
  getDepartmentComplaints,
} from "../../../api.js";

export default function DepartmentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dept, setDept] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState(deptData);

  useEffect(() => {
    const loggedDept = JSON.parse(localStorage.getItem("loggedDept"));
    if (loggedDept) setDept(loggedDept);

    // fetch initial complaints from backend (department-specific if dept found)
    const fetchComplaints = async () => {
      try {
        if (loggedDept && loggedDept.id) {
          // prefer department-scoped complaints when department is logged in
          const deptComplaints = await getDepartmentComplaints(loggedDept.id);
          // ensure we store and display an array
          setComplaints(Array.isArray(deptComplaints) ? deptComplaints : []);
          // keep a copy in localStorage so other parts of the app can read it if needed
          localStorage.setItem(
            "complaints",
            JSON.stringify(Array.isArray(deptComplaints) ? deptComplaints : [])
          );
        } else {
          // fallback: fetch all complaints
          const all = await getAllComplaints();
          setComplaints(Array.isArray(all) ? all : []);
          localStorage.setItem(
            "complaints",
            JSON.stringify(Array.isArray(all) ? all : [])
          );
        }
      } catch (err) {
        console.error("Error fetching complaints from backend:", err);
        // fallback to localStorage if backend fails
        const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
        setComplaints(storedComplaints);
      }
    };

    fetchComplaints();

    // re-sync when remote changes by listening to storage events (other tabs) or custom events
    const onStorage = () => {
      const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
      setComplaints(stored);
    };
    window.addEventListener("storage", onStorage);

    // optional custom event to trigger re-fetch from backend across app
    const reFetchListener = async (e) => {
      // if event detail contains "refreshComplaints", refetch from server
      if (!e?.detail || !e.detail.refreshComplaints) return;
      await fetchComplaints();
    };
    window.addEventListener("app:refresh", reFetchListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("app:refresh", reFetchListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedDept");
    window.location.href =
      "/Infosys_CivicPulse-Hub-Unified-Smart-City-Feedback-and-Redressal-System/loginselection";
  };

  // helper to refresh complaints from backend on-demand
  const refreshComplaintsFromServer = async () => {
    try {
      if (dept && dept.id) {
        const deptComplaints = await getDepartmentComplaints(dept.id);
        setComplaints(Array.isArray(deptComplaints) ? deptComplaints : []);
        localStorage.setItem(
          "complaints",
          JSON.stringify(Array.isArray(deptComplaints) ? deptComplaints : [])
        );
      } else {
        const all = await getAllComplaints();
        setComplaints(Array.isArray(all) ? all : []);
        localStorage.setItem(
          "complaints",
          JSON.stringify(Array.isArray(all) ? all : [])
        );
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  const total = complaints.length;
  const resolved = complaints.filter(
    (c) => c.status === "Closed" || c.status === "Resolved"
  ).length;
  const pending = complaints.filter(
    (c) => c.status !== "Closed" && c.status !== "Resolved"
  ).length;

  const renderSection = () => {
    switch (activeSection) {
      case "track":
        // pass a prop to allow DeptComplaintTracking to request refresh after edits
        return <DeptComplaintTracking deptId={dept?.id} onRefresh={refreshComplaintsFromServer} />;
      case "departments":
        return (
          <DepartmentDetails
            departments={departments}
            setDepartments={setDepartments}
          />
        );
      case "feedback":
        return <DepartmentFeedback deptId={dept?.id} />;
      default:
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {dept?.name || "Department"} 👋
            </h1>
            <div className="cards-container">
              <div className="card neon">
                <FaClipboardList className="icon" />
                <h3>Total Complaints</h3>
                <p>{total}</p>
              </div>

              <div className="card neon">
                <FaCheckCircle className="icon" />
                <h3>Resolved</h3>
                <p>{resolved}</p>
              </div>

              <div className="card neon">
                <FaUsers className="icon" />
                <h3>Pending</h3>
                <p>{pending}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Civic Hub</h2>
        <ul className="sidebar-menu">
          <li
            onClick={() => setActiveSection("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            <FaHome /> Home
          </li>
          <li
            onClick={() => setActiveSection("track")}
            className={activeSection === "track" ? "active" : ""}
          >
            <FaClipboardList /> Complaint Tracking
          </li>
          <li
            onClick={() => setActiveSection("departments")}
            className={activeSection === "departments" ? "active" : ""}
          >
            <FaBuilding /> Departments
          </li>
          <li
            onClick={() => setActiveSection("feedback")}
            className={activeSection === "feedback" ? "active" : ""}
          >
            <FaCommentDots /> Feedback
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="main-content">{renderSection()}</main>

      {/* === Neon Styles === */}
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
          font-size: 1.7rem;
          text-align: center;
          color: #00eaff;
          font-weight: 700;
          text-shadow: 0 0 15px #00eaff;
          margin-bottom: 30px;
        }

        .sidebar-menu li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          color: #ccc;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          margin-bottom: 8px;
        }

        .sidebar-menu li.active,
        .sidebar-menu li:hover {
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
        }

        .logout-btn:hover {
          background: linear-gradient(90deg, #ff6666, #ff0000);
          transform: scale(1.05);
        }

        .main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        /* === Home Section === */
        .welcome-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 50px;
        }

        .welcome-title {
          font-size: 2.8rem;
          text-align: center;
          color: #00eaff;
          text-shadow: 0 0 25px #00eaff, 0 0 50px #00eaff33;
          font-weight: 700;
          margin-bottom: 50px;
          letter-spacing: 1px;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 50px;
          flex-wrap: wrap;
        }

        .card {
          background: rgba(15, 20, 30, 0.95);
          border-radius: 15px;
          padding: 25px 40px;
          text-align: center;
          width: 230px;
          border: 1px solid #00eaff44;
          box-shadow: 0 0 20px #00eaff33, inset 0 0 10px #00eaff22;
          transition: all 0.3s ease;
        }

        .card.neon {
          animation: glowPulse 3s infinite ease-in-out;
        }

        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px #00eaff99, 0 0 60px #00eaff55;
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
          font-size: 1.8rem;
          color: #00eaff;
          margin-bottom: 10px;
        }

        .card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #00eaff;
          margin-bottom: 8px;
        }

        .card p {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}
