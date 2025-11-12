import React, { useEffect, useState } from "react";
import {
  FaPaperPlane,
  FaUndo,
  FaCheckCircle,
  FaEye,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

export default function AdminTrackComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedDept, setSelectedDept] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [closeModal, setCloseModal] = useState({ show: false, id: null, days: "" });

  const departments = [
    "Health Department",
    "Education Department",
    "Sanitation Department",
    "Water Department",
    "Infrastructure Department",
    "Transport Department",
    "Electricity Department",
    "Fire Department",
    "Parks & Recreation Department",
    "Revenue Department",
    "Other",
  ];

  // 🔹 Load complaints
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
    const formatted = stored.map((c) => ({
      ...c,
      timestamp: c.timestamp || c.createdDate || new Date().toISOString(),
    }));
    setComplaints(formatted);
    localStorage.setItem("complaints", JSON.stringify(formatted));
  }, []);

  // 🔹 Update complaint
  const updateComplaint = (id, updates) => {
    const updated = complaints.map((c) => {
      if (c.id === id) {
        const now = new Date().toISOString();
        let newC = { ...c, ...updates, lastUpdated: now };
        if (updates.status === "Closed") newC.closedDate = now;
        if (updates.status === "Reopened" || updates.status === "Open") delete newC.closedDate;
        if (updates.daysTaken) newC.daysTaken = updates.daysTaken;
        if (updates.slaDays) newC.daysTaken = updates.slaDays;
        return newC;
      }
      return c;
    });
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  // 🔹 Assign department
  const sendToDepartment = (id) => {
    if (!selectedDept[id]) {
      alert("⚠️ Please select a department first!");
      return;
    }
    updateComplaint(id, { dept: selectedDept[id], status: "Assigned" });
    alert(`✅ Complaint assigned to ${selectedDept[id]} department`);
  };

  // 🔹 Open close modal
  const openCloseModal = (id) => {
    setCloseModal({ show: true, id, days: "" });
  };

  // 🔹 Confirm close complaint
  const confirmCloseComplaint = () => {
    const { id, days } = closeModal;
    const slaDays = parseInt(days);
    if (isNaN(slaDays) || slaDays < 0) {
      alert("⚠️ Please enter a valid number of days.");
      return;
    }
    const slaPoints =
      slaDays <= 10
        ? 100
        : slaDays <= 15
        ? 90
        : slaDays <= 20
        ? 80
        : slaDays <= 25
        ? 70
        : slaDays <= 30
        ? 60
        : 30;

    updateComplaint(id, { status: "Closed", slaDays, slaPoints });
    setCloseModal({ show: false, id: null, days: "" });
    alert(`✅ Complaint closed!\nDays: ${slaDays}\nSLA Points: ${slaPoints}`);
  };

  // 🔹 Reopen complaint
  const reopenComplaint = (id) => {
    updateComplaint(id, { status: "Reopened" });
    alert("🔁 Complaint reopened.");
  };

  // 🔹 Delete all complaints
  const clearAllComplaints = () => {
    if (window.confirm("⚠️ Are you sure you want to delete ALL complaints?")) {
      localStorage.removeItem("complaints");
      setComplaints([]);
      alert("🧹 All complaints cleared!");
    }
  };

  return (
    <div className="admin-track-container">
      <h2 className="title">Complaint Tracking</h2>

      {complaints.length > 0 && (
        <div className="delete-icon-container">
          <FaTrash title="Delete All Complaints" onClick={clearAllComplaints} />
        </div>
      )}

      {complaints.length === 0 ? (
        <p className="no-data">No complaints found yet.</p>
      ) : (
        <div className="table-container">
          <table className="complaint-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Title</th>
                <th>Department</th>
                <th>Status</th>
                <th>Created</th>
                <th>Days Taken</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.userEmail || "Anonymous"}</td>
                  <td>{c.title}</td>
                  <td>
                    {(c.status === "open" || c.status === "Reopened") ? (
                      <select
                        value={selectedDept[c.id] || ""}
                        onChange={(e) =>
                          setSelectedDept({ ...selectedDept, [c.id]: e.target.value })
                        }
                        className="dept-select"
                      >
                        <option value="">Select Dept</option>
                        {departments.map((d, i) => (
                          <option key={i} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    ) : (
                      c.dept || "—"
                    )}
                  </td>
                  <td className={`status ${c.status.toLowerCase()}`}>{c.status}</td>
                  <td>{new Date(c.timestamp).toLocaleDateString()}</td>
                  <td>{c.daysTaken ? `${c.daysTaken} days` : "—"}</td>
                  <td className="action-buttons">
                    <button onClick={() => setSelectedComplaint(c)} title="View Complaint">
                      <FaEye />
                    </button>
                    {(c.status === "open" || c.status === "Reopened") && (
                      <button onClick={() => sendToDepartment(c.id)} title="Assign">
                        <FaPaperPlane />
                      </button>
                    )}
                    {c.status !== "Closed" && (
                      <button onClick={() => openCloseModal(c.id)} title="Close">
                        <FaCheckCircle />
                      </button>
                    )}
                    {c.status === "Closed" && (
                      <button onClick={() => reopenComplaint(c.id)} title="Reopen">
                        <FaUndo />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Complaint View Modal */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div className="view-card" onClick={(e) => e.stopPropagation()}>
            <div className="view-header">
              <button className="back-btn" onClick={() => setSelectedComplaint(null)}>
                <FaArrowLeft /> Back
              </button>
              <h3>Complaint Details</h3>
            </div>
            <div className="view-body">
              <p><strong>Title:</strong> {selectedComplaint.title}</p>
              <p><strong>Description:</strong> {selectedComplaint.description || "No details provided."}</p>
              <p><strong>Status:</strong> {selectedComplaint.status}</p>
              <p><strong>Department:</strong> {selectedComplaint.dept || "—"}</p>
              {selectedComplaint.photo && (
                <img
                  src={selectedComplaint.photo}
                  alt="Complaint"
                  className="view-img"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Close Complaint Modal */}
      {closeModal.show && (
        <div
          className="modal-backdrop"
          onClick={() => setCloseModal({ show: false, id: null, days: "" })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Close Complaint</h3>
            <p>Enter how many days it took to close this complaint:</p>
            <input
              type="number"
              value={closeModal.days}
              onChange={(e) =>
                setCloseModal({ ...closeModal, days: e.target.value })
              }
              placeholder="Number of days"
              className="input-field"
            />
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmCloseComplaint}>
                Confirm
              </button>
              <button
                className="cancel-btn"
                onClick={() => setCloseModal({ show: false, id: null, days: "" })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .admin-track-container {
          background: #000814;
          border: 1px solid #00eaff55;
          box-shadow: 0 0 30px #00eaff22;
          border-radius: 15px;
          padding: 25px;
          color: #fff;
          min-height: 100vh;
          position: relative;
        }

        .title {
          text-align: center;
          font-size: 2rem;
          color: #00eaff;
          text-shadow: 0 0 10px #00eaff;
          margin-bottom: 15px;
        }

        .delete-icon-container {
          position: absolute;
          top: 25px;
          right: 25px;
          cursor: pointer;
          color: #ff5555;
          font-size: 1.5rem;
          transition: 0.3s;
        }

        .delete-icon-container:hover {
          color: #ff7777;
        }

        th,
        td {
          padding: 14px 18px;
          border-bottom: 1px solid #00eaff22;
        }

        th {
          background: rgba(0, 234, 255, 0.1);
          color: #00eaff;
        }

        tr:hover {
          background: rgba(0, 234, 255, 0.08);
        }

        .dept-select {
          background: transparent;
          border: 1px solid #00eaff55;
          color: #00eaff;
          border-radius: 8px;
          padding: 5px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .view-card {
          background: #111b2a;
          border-radius: 15px;
          padding: 25px;
          width: 420px;
          box-shadow: 0 0 25px #00eaff66;
          color: #fff;
        }

        .view-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .back-btn {
          background: transparent;
          color: #00eaff;
          border: 1px solid #00eaff55;
          border-radius: 8px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .view-img {
          width: 100%;
          height: auto;
          border-radius: 10px;
          margin-top: 10px;
        }

        .modal-content {
          background: #111b2a;
          border-radius: 12px;
          padding: 25px;
          width: 400px;
          box-shadow: 0 0 20px #00eaff66;
          text-align: center;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #00eaff66;
          background: #001220;
          color: #00eaff;
          margin-top: 10px;
          text-align: center;
        }

        .confirm-btn,
        .cancel-btn {
          width: 48%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .confirm-btn {
          background: #00eaff;
          color: #000;
        }

        .cancel-btn {
          background: #ff3b3b;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
