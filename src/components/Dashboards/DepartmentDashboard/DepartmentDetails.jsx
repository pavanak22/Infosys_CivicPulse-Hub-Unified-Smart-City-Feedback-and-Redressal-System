import React, { useState, useEffect } from "react";
import { FaBuilding, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../api.js"; // ✅ Backend API functions

export default function DepartmentDetails() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // ✅ Fetch departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Add or Edit Department
  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await updateDepartment(editingDept._id || editingDept.id, formData);
      } else {
        await addDepartment(formData);
      }

      setShowForm(false);
      setEditingDept(null);
      setFormData({
        name: "",
        head: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        staffCount: "",
      });

      await loadDepartments();
    } catch (err) {
      console.error("❌ Error saving department:", err);
    }
  };

  // ✅ Edit Department
  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || "",
      head: dept.head || "",
      contactPerson: dept.contactPerson || "",
      phone: dept.phone || "",
      email: dept.email || "",
      address: dept.address || "",
      staffCount: dept.staffCount || "",
    });
    setShowForm(true);
  };

  // ✅ Delete Department
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        await loadDepartments();
      } catch (err) {
        console.error("❌ Error deleting department:", err);
      }
    }
  };

  return (
    <div className="welcome-section">
      <h1 className="welcome-title">Departments</h1>

      {loading ? (
        <p style={{ textAlign: "center", color: "#00eaff" }}>Loading departments...</p>
      ) : departments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#bbb" }}>No departments found. Add one below.</p>
      ) : null}

      <div className="dept-grid">
        {departments.map((d) => (
          <div key={d._id || d.id} className="card neon">
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
              <button className="delete-btn" onClick={() => handleDelete(d._id || d.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add Department Card */}
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

      {/* Add/Edit Form Popup */}
      {showForm && (
        <div className="form-popup">
          <form className="form-box" onSubmit={handleAddOrEdit}>
            <h2>{editingDept ? "Edit Department" : "Add Department"}</h2>
            {["name", "head", "contactPerson", "phone", "email", "address", "staffCount"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                />
              )
            )}
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save
              </button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* === Neon UI Styles === */}
      <style jsx="true">{`
        .dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
          justify-items: center;
          margin-top: 20px;
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
        .save-btn {
          background: #00eaff;
          color: #000;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
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
      `}</style>
    </div>
  );
}
