import React, { useEffect, useState } from "react";
import { FaEye, FaArrowLeft, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function DeptComplaintTracking() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [closingComplaint, setClosingComplaint] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [daysTaken, setDaysTaken] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(stored);
  }, []);

  // Handle closing complaint
  const handleCloseComplaint = (id) => {
    const updated = complaints.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "Closed",
            deptName,
            daysTaken,
            lastUpdated: new Date().toISOString(),
          }
        : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
    setClosingComplaint(null);
    setDeptName("");
    setDaysTaken("");
  };

  return (
    <div className="dept-track-container">
      <h2 className="title">Complaint Tracking</h2>

      {complaints.length === 0 ? (
        <p className="no-data">No complaints assigned yet.</p>
      ) : (
        <div className="table-container">
          <table className="complaint-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Days Taken</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.userEmail || "Anonymous"}</td>
                  <td>{c.title}</td>
                  <td>{c.priority || "Normal"}</td>
                  <td className={`status ${c.status?.toLowerCase()}`}>{c.status}</td>
                  <td>{c.daysTaken ? `${c.daysTaken} days` : "—"}</td>
                  <td>
                    {c.lastUpdated
                      ? new Date(c.lastUpdated).toLocaleString()
                      : new Date(c.timestamp).toLocaleString()}
                  </td>
                  <td className="action-cell">
                    <button
                      className="eye-btn"
                      title="View Complaint"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="close-btn"
                      title="Mark as Closed"
                      onClick={() => setClosingComplaint(c)}
                    >
                      <FaCheckCircle />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === VIEW COMPLAINT CARD === */}
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
              <p>
                <strong>Title:</strong> {selectedComplaint.title}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedComplaint.description || "No details provided."}
              </p>
              <p>
                <strong>Status:</strong> {selectedComplaint.status}
              </p>
              <p>
                <strong>Days Taken:</strong> {selectedComplaint.daysTaken || "—"}
              </p>
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

      {/* === CLOSE COMPLAINT CARD === */}
      {closingComplaint && (
        <div className="modal-backdrop" onClick={() => setClosingComplaint(null)}>
          <div className="close-card" onClick={(e) => e.stopPropagation()}>
            <h3>Close Complaint</h3>
            <label>
              Department Name:
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="Enter department name"
              />
            </label>
            <label>
              Days Taken:
              <input
                type="number"
                value={daysTaken}
                onChange={(e) => setDaysTaken(e.target.value)}
                placeholder="Enter number of days"
              />
            </label>

            <div className="action-buttons">
              <button
                className="ok-btn"
                onClick={() => handleCloseComplaint(closingComplaint.id)}
              >
                <FaCheckCircle /> OK
              </button>
              <button className="cancel-btn" onClick={() => setClosingComplaint(null)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === STYLES === */}
      <style jsx="true">{`
        .dept-track-container {
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

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th,
        td {
          padding: 12px 16px;
          border-bottom: 1px solid #00eaff22;
        }

        th {
          background: rgba(0, 234, 255, 0.1);
          color: #00eaff;
        }

        tr:hover {
          background: rgba(0, 234, 255, 0.08);
        }

        .action-cell {
          display: flex;
          gap: 10px;
        }

        .eye-btn,
        .close-btn {
          background: transparent;
          border: none;
          color: #00eaff;
          cursor: pointer;
          font-size: 1.2rem;
          transition: 0.3s;
        }

        .eye-btn:hover,
        .close-btn:hover {
          color: #00ffff;
          transform: scale(1.1);
        }

        /* === MODAL STYLING === */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease;
        }

        .view-card,
        .close-card {
          background: rgba(12, 20, 35, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 234, 255, 0.3);
          border-radius: 18px;
          padding: 25px;
          width: 420px;
          box-shadow: 0 0 35px rgba(0, 234, 255, 0.4);
          color: #fff;
          animation: scaleIn 0.3s ease;
        }

        .view-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .back-btn {
          background: rgba(0, 234, 255, 0.1);
          color: #00eaff;
          border: 1px solid rgba(0, 234, 255, 0.4);
          border-radius: 10px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(0, 234, 255, 0.25);
          box-shadow: 0 0 10px rgba(0, 234, 255, 0.4);
        }

        .view-body p {
          margin: 6px 0;
          font-size: 0.95rem;
        }

        .view-body strong {
          color: #00eaff;
        }

        .view-img {
          width: 100%;
          border-radius: 10px;
          margin-top: 12px;
          border: 1px solid rgba(0, 234, 255, 0.3);
          box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
        }

        /* === CLOSE CARD === */
        .close-card label {
          display: block;
          margin-top: 10px;
          color: #00eaff;
          font-size: 0.9rem;
        }

        .close-card input {
          width: 100%;
          margin-top: 6px;
          padding: 8px;
          border-radius: 8px;
          border: none;
          outline: none;
          background: rgba(0, 234, 255, 0.1);
          color: #fff;
        }

        .action-buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }

        .ok-btn,
        .cancel-btn {
          background: rgba(0, 234, 255, 0.1);
          color: #00eaff;
          border: 1px solid rgba(0, 234, 255, 0.4);
          border-radius: 10px;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .ok-btn:hover {
          background: rgba(0, 234, 255, 0.25);
        }

        .cancel-btn:hover {
          background: rgba(255, 0, 0, 0.25);
          border-color: rgba(255, 0, 0, 0.4);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
