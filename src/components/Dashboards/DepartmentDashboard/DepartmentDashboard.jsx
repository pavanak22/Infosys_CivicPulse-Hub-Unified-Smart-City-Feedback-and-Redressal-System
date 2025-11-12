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

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("loggedDept");
    window.location.href = "/loginselection";
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (editingDept) {
      // Edit existing
      const updated = departments.map((d) =>
        d.id === editingDept.id ? { ...formData, id: d.id } : d
      );
      setDepartments(updated);
    } else {
      // Add new
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

  // --- Stats ---
  const total = complaints.length;
  const resolved = complaints.filter(
    (c) => c.status === "Closed" || c.status === "Resolved"
  ).length;
  const pending = complaints.filter(
    (c) => c.status !== "Closed" && c.status !== "Resolved"
  ).length;

  // --- Section Rendering ---
  const renderSection = () => {
    switch (activeSection) {
      case "track":
        return <DeptComplaintTracking deptId={dept?.id} />;

      case "departments":
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">Departments</h1>

            {/* Department Cards */}
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

              {/* Add Department Button (Moved to End) */}
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

            {/* Add/Edit Department Form */}
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
      {/* Sidebar */}
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

        /* Sidebar same as before */
        .sidebar { width: 240px; background: rgba(10,15,20,0.9); border-right: 2px solid #00eaff55; box-shadow: inset 0 0 25px #00eaff33, 0 0 20px #00eaff22; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; }
        .sidebar-title { font-size: 1.5rem; text-align: center; color: #00eaff; margin-bottom: 30px; text-shadow: 0 0 10px #00eaff; }
        .sidebar-menu li { padding: 12px 10px; color: #ccc; cursor: pointer; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
        .sidebar-menu li.active, .sidebar-menu li:hover { color: #00eaff; background: rgba(0,234,255,0.1); transform: translateX(5px); box-shadow: 0 0 10px #00eaff33; }

        .logout-btn { background: linear-gradient(90deg, #ff4444, #cc0000); border: none; color: #fff; padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .logout-btn:hover { background: linear-gradient(90deg, #ff6666, #ff0000); transform: scale(1.05); }

        .main-content { flex: 1; padding: 30px; overflow-y: auto; }
        .welcome-title { font-size: 2.2rem; text-align: center; color: #00eaff; text-shadow: 0 0 15px #00eaff, 0 0 25px #7a00ff; margin-bottom: 40px; }

        .cards-container, .dept-grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .card { background: rgba(20,25,35,0.85); border-radius: 15px; padding: 25px; text-align: center; color: #ddd; transition: 0.3s; min-width: 220px; max-width: 300px; }
        .card.neon { border: 1px solid #00eaff44; box-shadow: 0 0 15px #00eaff33, 0 0 30px #7a00ff22; }
        .card.neon:hover { box-shadow: 0 0 25px #00eaffaa, 0 0 50px #7a00ffaa; transform: translateY(-5px); }

        .add-card { cursor: pointer; color: #00eaff; }
        .add-card:hover { background: rgba(0,234,255,0.1); }

        .btn-group { display: flex; justify-content: center; gap: 10px; margin-top: 10px; }
        .edit-btn, .delete-btn { border: none; border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #fff; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; }
        .edit-btn { background: #007bff; }
        .edit-btn:hover { background: #339aff; }
        .delete-btn { background: #d9534f; }
        .delete-btn:hover { background: #ff6666; }

        .form-popup { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; }
        .form-box { background: #0b1a2a; padding: 25px; border-radius: 15px; box-shadow: 0 0 20px #00eaff88; width: 400px; display: flex; flex-direction: column; gap: 12px; }
        .form-box input { padding: 10px; border: none; border-radius: 8px; outline: none; }
        .form-actions { display: flex; justify-content: space-between; margin-top: 10px; }
        .save-btn { background: #00eaff; color: #000; padding: 8px 15px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .cancel-btn { background: #ff4444; padding: 8px 15px; border-radius: 8px; font-weight: 600; cursor: pointer; color: #fff; }
      `}</style>
    </div>
  );
}
