import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaClipboardList,
  FaBuilding,
  FaSignOutAlt,
  FaUsers,
  FaCheckCircle,
  FaCommentDots,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { departments as deptData } from "../../Data/department.js";
import DeptComplaintTracking from "./DeptComplaintTracking.jsx";
import DepartmentFeedback from "../../Feedback/DepartmentFeedback.jsx";

export default function DepartmentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dept, setDept] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState(deptData);
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    staffCount: "",
  });

  useEffect(() => {
    const loggedDept = JSON.parse(localStorage.getItem("loggedDept"));
    const storedComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    if (loggedDept) setDept(loggedDept);
    setComplaints(storedComplaints);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedDept");
    window.location.href =
      "/Infosys_CivicPulse-Hub-Unified-Smart-City-Feedback-and-Redressal-System/loginselection";
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (editingDept) {
      const updated = departments.map((d) =>
        d.id === editingDept.id ? { ...formData, id: d.id } : d
      );
      setDepartments(updated);
    } else {
      const newDept = { ...formData, id: Date.now(), employees: [] };
      setDepartments([...departments, newDept]);
    }
    setFormData({
      name: "",
      head: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      staffCount: "",
    });
    setShowForm(false);
    setEditingDept(null);
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData(dept);
    setShowForm(true);
  };

  const handleDelete = (id) =>
    setDepartments(departments.filter((d) => d.id !== id));

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
        return <DeptComplaintTracking deptId={dept?.id} />;

      case "departments":
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">Departments</h1>
            <div className="dept-grid">
              {departments.map((d) => (
                <div key={d.id} className="card neon">
                  <FaBuilding className="icon" />
                  <h3>{d.name}</h3>
                  <p><strong>Head:</strong> {d.head}</p>
                  <p><strong>Contact:</strong> {d.contactPerson}</p>
                  <p><strong>Phone:</strong> {d.phone}</p>
                  <p><strong>Email:</strong> {d.email}</p>
                  <p><strong>Address:</strong> {d.address}</p>
                  <p><strong>Staff Count:</strong> {d.staffCount}</p>
                  <div className="btn-group">
                    <button className="edit-btn" onClick={() => handleEdit(d)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(d.id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}

              <div
                className="card neon add-card"
                onClick={() => {
                  setShowForm(true);
                  setEditingDept(null);
                }}
              >
                <FaPlus className="icon" />
                <h3>Add Department</h3>
              </div>
            </div>

            {showForm && (
              <div className="form-popup">
                <form className="form-box" onSubmit={handleAddOrEdit}>
                  <h2>{editingDept ? "Edit Department" : "Add Department"}</h2>
                  {[
                    "name",
                    "head",
                    "contactPerson",
                    "phone",
                    "email",
                    "address",
                    "staffCount",
                  ].map((field) => (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                    />
                  ))}
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
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
                <FaUsers className="icon" />
                <h3>Pending</h3>
                <p>{pending}</p>
              </div>
              <div className="card neon">
                <FaCheckCircle className="icon" />
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
      <aside className="sidebar">
        <h2 className="sidebar-title">Civic Hub</h2>
        <ul className="sidebar-menu">
          <li onClick={() => setActiveSection("dashboard")} className={activeSection === "dashboard" ? "active" : ""}>
            <FaHome /> Home
          </li>
          <li onClick={() => setActiveSection("track")} className={activeSection === "track" ? "active" : ""}>
            <FaClipboardList /> Complaint Tracking
          </li>
          <li onClick={() => setActiveSection("departments")} className={activeSection === "departments" ? "active" : ""}>
            <FaBuilding /> Departments
          </li>
          <li onClick={() => setActiveSection("feedback")} className={activeSection === "feedback" ? "active" : ""}>
            <FaCommentDots /> Feedback
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="main-content">{renderSection()}</main>

      {/* === Neon UI Styles === */}
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

        .welcome-title {
          font-size: 2.4rem;
          text-align: center;
          color: #00eaff;
          text-shadow: 0 0 20px #00eaff;
          margin-bottom: 40px;
          font-weight: 700;
        }

        /* === NEW HORIZONTAL CARDS === */
        .cards-container {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 25px;
          flex-wrap: wrap;
        }

        /* === DEPARTMENT GRID === */
        .dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
          justify-items: center;
        }

        .card {
          background: rgba(15, 20, 30, 0.9);
          border-radius: 15px;
          padding: 25px;
          width: 320px;
          text-align: center;
          box-shadow: 0 0 20px #00eaff22, inset 0 0 10px #00eaff22;
          border: 1px solid #00eaff55;
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 0 30px #00eaffaa, 0 0 60px #00eaff55;
          transform: translateY(-5px);
        }

        .icon {
          font-size: 1.5rem;
          color: #00eaff;
          margin-bottom: 10px;
        }

        .card h3 {
          color: #00eaff;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .card p {
          color: #ddd;
          font-size: 0.95rem;
          margin: 4px 0;
        }

        .btn-group {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          color: #fff;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .edit-btn {
          background: #007bff;
          box-shadow: 0 0 10px #007bff66;
        }

        .edit-btn:hover {
          background: #339aff;
          box-shadow: 0 0 15px #007bffaa;
        }

        .delete-btn {
          background: #d9534f;
          box-shadow: 0 0 10px #ff333366;
        }

        .delete-btn:hover {
          background: #ff6666;
          box-shadow: 0 0 15px #ff3333aa;
        }

        /* === FORM POPUP === */
        .form-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .form-box {
          background: rgba(10, 15, 25, 0.95);
          padding: 30px 35px;
          border-radius: 20px;
          box-shadow: 0 0 40px #00eaff66, inset 0 0 15px #00eaff33;
          width: 420px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          border: 1px solid #00eaff55;
          text-align: center;
        }

        .form-box h2 {
          color: #00eaff;
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 0 0 15px #00eaff;
        }

        .form-box input {
          padding: 10px 12px;
          border: none;
          border-radius: 10px;
          outline: none;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 0.95rem;
          transition: 0.3s;
        }

        .form-box input:focus {
          box-shadow: 0 0 10px #00eaff;
          border: 1px solid #00eaff66;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .save-btn {
          background: #00eaff;
          color: #000;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .save-btn:hover {
          box-shadow: 0 0 15px #00eaffaa;
        }

        .cancel-btn {
          background: #ff4444;
          color: #fff;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .cancel-btn:hover {
          box-shadow: 0 0 15px #ff4444aa;
        }
      `}</style>
    </div>
  );
}
