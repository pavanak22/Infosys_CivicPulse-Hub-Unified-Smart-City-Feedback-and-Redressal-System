import React, { useEffect, useState } from "react";
import { FaUser, FaCommentDots, FaStar, FaBuilding, FaEye } from "react-icons/fa";

export default function DeptFeedback({ deptId, deptName }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    setFeedbacks(stored);

    if (deptName) {
      const deptFeedbacks = stored.filter(
        (fb) =>
          fb.deptName &&
          fb.deptName.trim().toLowerCase() === deptName.trim().toLowerCase()
      );
      setFilteredFeedbacks(
        deptFeedbacks.length === 0 ? stored : deptFeedbacks
      );
    } else {
      setFilteredFeedbacks(stored);
    }
  }, [deptId, deptName]);

  return (
    <div className="feedback-page">
      <h1 className="feedback-title">
        Department Feedback 💬{" "}
        {deptName && <span style={{ fontSize: "1rem", color: "#aaa" }}>({deptName})</span>}
      </h1>

      {filteredFeedbacks.length === 0 ? (
        <p className="no-feedback">No feedbacks found in the system yet.</p>
      ) : (
        <div className="feedback-grid">
          {filteredFeedbacks.map((fb, i) => (
            <div key={i} className="feedback-card neon">
              <FaBuilding className="dept-icon" />
              <h3>{fb.deptName || "Unknown Department"}</h3>

              <div className="user-section">
                <FaUser className="user-icon" />
                <span>{fb.userName || "Anonymous User"}</span>
              </div>

              <p className="comment">
                <FaCommentDots /> {fb.comment}
              </p>

              <p className="rating">
                <FaStar /> Rating: {fb.rating || "N/A"}
              </p>

              <button
                className="view-btn"
                onClick={() => setSelectedFeedback(fb)}
              >
                <FaEye /> View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing details */}
      {selectedFeedback && (
        <div className="modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Feedback Details</h2>
            <p><strong>Department:</strong> {selectedFeedback.deptName}</p>
            <p><strong>User:</strong> {selectedFeedback.userName}</p>
            <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
            <p><strong>Rating:</strong> ⭐ {selectedFeedback.rating}</p>
            {selectedFeedback.photo && (
              <img
                src={selectedFeedback.photo}
                alt="Feedback"
                className="modal-photo"
              />
            )}
            <p><small>Submitted on {selectedFeedback.date}</small></p>
            <button
              className="close-btn"
              onClick={() => setSelectedFeedback(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .feedback-page {
          text-align: center;
          color: #fff;
          padding: 25px;
          background: rgba(10, 15, 25, 0.85);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 25px #00eaff22, inset 0 0 15px #8b5cf688;
        }

        .feedback-title {
          font-size: 2rem;
          color: #00eaff;
          text-shadow: 0 0 10px #00eaff;
          margin-bottom: 30px;
        }

        .feedback-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .feedback-card {
          background: rgba(20, 25, 35, 0.9);
          border-radius: 15px;
          width: 260px;
          padding: 20px;
          transition: all 0.3s ease;
          border: 1px solid #00eaff44;
          position: relative;
        }

        .view-btn {
          background: #00eaff22;
          color: #00eaff;
          border: 1px solid #00eaff66;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .view-btn:hover {
          background: #00eaff44;
          box-shadow: 0 0 10px #00eaff66;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #111827;
          color: #fff;
          padding: 25px;
          border-radius: 12px;
          width: 350px;
          text-align: left;
          box-shadow: 0 0 25px #00eaff55;
        }

        .modal-photo {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-top: 10px;
        }

        .close-btn {
          background: #f87171;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          margin-top: 15px;
          cursor: pointer;
        }

        .close-btn:hover {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
}
