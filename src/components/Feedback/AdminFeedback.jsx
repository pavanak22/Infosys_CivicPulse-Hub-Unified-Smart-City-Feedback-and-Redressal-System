import React, { useEffect, useState } from "react";
import { FaUser, FaCommentDots, FaStar, FaEye, FaTrash } from "react-icons/fa";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // 🔹 Load feedbacks from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("feedbacks") || "[]");

    // Remove duplicates based on comment + userName
    const unique = stored.filter(
      (fb, index, arr) =>
        index ===
        arr.findIndex(
          (f) => f.comment === fb.comment && f.userName === fb.userName
        )
    );

    setFeedbacks(unique);
    localStorage.setItem("feedbacks", JSON.stringify(unique));
  }, []);

  // 🔹 Clear all feedbacks
  const clearAllFeedbacks = () => {
    if (window.confirm("⚠️ Are you sure you want to clear all feedbacks?")) {
      localStorage.removeItem("feedbacks");
      setFeedbacks([]);
    }
  };

  const closeModal = () => setSelectedFeedback(null);

  return (
    <div className="feedback-page">
      <h1 className="feedback-title">User Feedbacks 💬</h1>

      {/* 🧹 Clear Button */}
      {feedbacks.length > 0 && (
        <button className="clear-btn" onClick={clearAllFeedbacks}>
          <FaTrash /> Clear All Feedback
        </button>
      )}

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedbacks received yet.</p>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map((fb, i) => (
            <div key={i} className="feedback-card neon">
              <FaUser className="feedback-icon" />
              <h3>{fb.userName || "Anonymous"}</h3>

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
                <FaEye /> View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Modal for Viewing Feedback Details */}
      {selectedFeedback && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Feedback Details</h2>
            <p><strong>User:</strong> {selectedFeedback.userName || "N/A"}</p>
            <p><strong>Department:</strong> {selectedFeedback.deptName || "N/A"}</p>
            <p><strong>Complaint ID:</strong> {selectedFeedback.complaintId}</p>
            <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
            <p><strong>Rating:</strong> ⭐ {selectedFeedback.rating}</p>

            {selectedFeedback.photo ? (
              <img
                src={selectedFeedback.photo}
                alt="Uploaded"
                className="modal-photo"
              />
            ) : (
              <p style={{ color: "#aaa" }}>No photo uploaded</p>
            )}

            {selectedFeedback.problem && (
              <div className="problem-section">
                <strong>Problem Description:</strong>
                <p>{selectedFeedback.problem}</p>
              </div>
            )}

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Same CSS you used before */}
      <style jsx="true">{`
        .feedback-page {
          text-align: center;
          color: #fff;
          padding: 20px;
          min-height: 100vh;
          background: #000814;
        }

        .feedback-title {
          font-size: 2rem;
          color: #00eaff;
          text-shadow: 0 0 10px #00eaff;
          margin-bottom: 20px;
        }

        .clear-btn {
          background: #ff4444;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 25px;
          transition: 0.3s;
        }

        .clear-btn:hover {
          background: #ff2222;
          transform: scale(1.05);
        }

        .no-feedback {
          color: #ccc;
          font-size: 1.1rem;
          margin-top: 20px;
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
        }

        .feedback-card.neon {
          box-shadow: 0 0 15px #00eaff33, 0 0 30px #00eaff22;
          animation: glowPulse 3s infinite ease-in-out;
        }

        .feedback-card:hover {
          box-shadow: 0 0 25px #00eaffaa, 0 0 45px #00eaff66;
          transform: translateY(-5px);
        }

        .feedback-icon {
          color: #00eaff;
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        .comment {
          margin: 10px 0;
          color: #ddd;
          font-size: 0.95rem;
        }

        .rating {
          color: #ffcc00;
          font-weight: 600;
        }

        .view-btn {
          background: linear-gradient(90deg, #00eaff, #8b5cf6);
          border: none;
          color: #fff;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 10px;
          transition: 0.3s;
        }

        .view-btn:hover {
          transform: scale(1.05);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal-content {
          background: rgba(15, 20, 30, 0.95);
          border-radius: 12px;
          padding: 25px;
          width: 400px;
          text-align: left;
          color: #fff;
          border: 1px solid #00eaff55;
          box-shadow: 0 0 30px #00eaff55;
          animation: fadeIn 0.4s ease;
        }

        .modal-content h2 {
          text-align: center;
          color: #00eaff;
          margin-bottom: 15px;
        }

        .modal-photo {
          width: 100%;
          margin-top: 15px;
          border-radius: 8px;
        }

        .problem-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 10px;
          margin-top: 10px;
          border-radius: 8px;
        }

        .close-btn {
          margin-top: 15px;
          background: #00eaff;
          color: #000;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          cursor: pointer;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes glowPulse {
          0% { box-shadow: 0 0 10px #00eaff33, 0 0 20px #00eaff22; }
          50% { box-shadow: 0 0 25px #00eaffaa, 0 0 45px #00eaff66; }
          100% { box-shadow: 0 0 10px #00eaff33, 0 0 20px #00eaff22; }
        }
      `}</style>
    </div>
  );
}
