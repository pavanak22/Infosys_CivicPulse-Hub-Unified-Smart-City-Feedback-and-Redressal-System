import React, { useEffect, useState } from "react";
import { FaRegCommentDots, FaCheckCircle, FaStar, FaCamera } from "react-icons/fa";

export default function ComplaintTracking({ feedbacks, setFeedbacks }) {
  const [complaints, setComplaints] = useState([]);
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 🔄 Auto refresh every 3 seconds
  useEffect(() => {
    const fetchData = () => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) return;

      setLoggedInUser(user);

      const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
      const userComplaints = allComplaints.filter(
        (c) => c.userEmail === user.email
      );
      setComplaints(userComplaints);

      const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      setFeedbacks(storedFeedbacks);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [setFeedbacks]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = (complaintId) => {
    if (!rating || !comment.trim()) {
      alert("⭐ Please give rating and comment!");
      return;
    }

    const complaint = complaints.find((c) => c.id === complaintId);
    const solveCount = complaint?.solveCount || 1;

    const feedback = {
      id: Date.now(),
      complaintId,
      rating,
      comment,
      feedback_from: "User",
      userName: loggedInUser?.name || "Unknown User",
      deptName: complaint?.dept || "N/A",
      photo: photoPreview || null,
      feedbackRound: solveCount,
      date: new Date().toLocaleString(),
    };

    const newFeedbacks = [...feedbacks, feedback];
    localStorage.setItem("feedbacks", JSON.stringify(newFeedbacks));
    setFeedbacks(newFeedbacks);

    setActiveFeedbackId(null);
    setRating(0);
    setComment("");
    setPhoto(null);
    setPhotoPreview(null);
    alert("✅ Feedback submitted!");
  };

  if (!complaints.length) {
    return <div className="no-data">🚫 No complaints found yet.</div>;
  }

  const statusColors = {
    resolved: "text-green-400",
    closed: "text-red-400",
    open: "text-yellow-400",
    assigned: "text-cyan-400",
  };

  return (
    <div className="user-track-container">
      <h2 className="title">Complaint Tracking & Feedback</h2>

      <div className="table-container">
        <table className="complaint-table">
          <thead>
            <tr>
              {["ID", "Title", "Department", "Status", "Feedback"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => {
              const userFeedbacks = feedbacks.filter((f) => f.complaintId === c.id);
              const latestFeedbackRound = Math.max(
                ...userFeedbacks.map((f) => f.feedbackRound || 0),
                0
              );
              const canAskFeedback =
                (c.status === "Closed" || c.status === "Resolved") &&
                c.solveCount > latestFeedbackRound;

              const status = c.status?.toLowerCase() || "open";

              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.dept || "—"}</td>
                  <td className={statusColors[status] || "text-gray-400"}>
                    {c.status}
                  </td>
                  <td>
                    {canAskFeedback && (
                      <button
                        className="feedback-btn"
                        onClick={() => setActiveFeedbackId(c.id)}
                      >
                        <FaRegCommentDots /> Give Feedback
                      </button>
                    )}
                    {!canAskFeedback && userFeedbacks.length > 0 && (
                      <div className="feedback-badge">
                        <FaCheckCircle />{" "}
                        {userFeedbacks[userFeedbacks.length - 1].comment} (
                        {userFeedbacks[userFeedbacks.length - 1].rating}⭐)
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {activeFeedbackId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⭐ Feedback for Complaint #{activeFeedbackId}</h3>

            <p style={{ color: "#00eaff" }}>
              👤 {loggedInUser?.name} | 🏢{" "}
              {complaints.find((c) => c.id === activeFeedbackId)?.dept || "N/A"}
            </p>

            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`star ${rating >= star ? "active" : ""}`}
                />
              ))}
            </div>

            <textarea
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="upload-section">
              <label className="upload-label">
                <FaCamera /> Upload Photo (optional)
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="photo-preview" />
              )}
            </div>

            <div className="modal-actions">
              <button onClick={() => setActiveFeedbackId(null)}>Cancel</button>
              <button onClick={() => handleFeedbackSubmit(activeFeedbackId)}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx="true">{`
        .user-track-container {
          background: rgba(10, 15, 20, 0.9);
          border: 1px solid #00eaff55;
          box-shadow: 0 0 30px #00eaff22;
          border-radius: 15px;
          padding: 25px;
          color: #fff;
          min-height: 100vh;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          color: #00eaff;
          text-shadow: 0 0 10px #00eaff;
          margin-bottom: 25px;
        }
        .no-data {
          text-align: center;
          color: #aaa;
          font-size: 1.2rem;
          margin-top: 40px;
        }
        .complaint-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
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
        .feedback-btn {
          background: #00eaff;
          color: #000;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .feedback-badge {
          background: rgba(0, 255, 128, 0.1);
          border: 1px solid #00ff88;
          padding: 6px 10px;
          border-radius: 10px;
          color: #00ff88;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal-content {
          background: #0a0f14;
          border: 1px solid #00eaff66;
          border-radius: 15px;
          padding: 20px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }
        .rating {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-bottom: 10px;
        }
        .star {
          font-size: 1.5rem;
          cursor: pointer;
          color: #444;
          transition: 0.3s;
        }
        .star.active {
          color: #00eaff;
        }
        .upload-section {
          margin-top: 10px;
        }
        .upload-label {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          background: rgba(0, 234, 255, 0.1);
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
        }
        .upload-label input {
          display: none;
        }
        .photo-preview {
          margin-top: 10px;
          max-width: 100%;
          border-radius: 10px;
          border: 1px solid #00eaff55;
        }
        textarea {
          width: 90%;
          height: 80px;
          background: #0a0f14;
          border: 1px solid #00eaff44;
          color: #00eaff;
          border-radius: 8px;
          padding: 8px;
          resize: none;
        }
        .modal-actions {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
        }
        .modal-actions button {
          background: #00eaff;
          color: #000;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
}
