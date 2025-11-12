import React, { useState, useEffect } from "react";
import { FaStar, FaUpload, FaCheckCircle } from "react-icons/fa";

export default function UserFeedback({ complaintId, onFeedbackSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackRound, setFeedbackRound] = useState(1);
  const [userName, setUserName] = useState("");
  const [deptName, setDeptName] = useState("");

  // 🔹 Load previous feedback count and complaint info
  useEffect(() => {
    const allFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    const related = allFeedbacks.filter((f) => f.complaintId === complaintId);
    if (related.length > 0) {
      setFeedbackRound(related.length + 1);
    }

    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const complaint = complaints.find((c) => c.id === complaintId);

    if (complaint) {
      setUserName(complaint.userName || "Unknown User");
      setDeptName(complaint.dept || complaint.department || "N/A");
    }
  }, [complaintId]);

  // 🔹 Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Handle feedback submission with auto-reopen logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment) return;

    const feedback = {
      id: Date.now(),
      complaintId,
      feedback_from: "User",
      feedback_to: deptName || "Department",
      rating,
      comment,
      feedbackRound,
      photo: photoPreview || null,
      date: new Date().toLocaleString(),
      userName,
      deptName,
    };

    // Save feedback
    const allFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    allFeedbacks.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(allFeedbacks));

    // 🔥 Update complaint status if rating < 3
    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const updatedComplaints = complaints.map((c) => {
      if (c.id === complaintId) {
        const updated = {
          ...c,
          feedbackGiven: true,
          feedback: { rating, comment },
        };

        if (rating < 3) {
          updated.status = "Reopened";
          updated.reopenReason = "Low user rating";
          updated.lastUpdated = new Date().toLocaleString();
        }

        return updated;
      }
      return c;
    });

    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));

    // 🔹 Optional alert or toast
    if (rating < 3) {
      alert(
        "Feedback submitted! Since rating is below 3, this complaint has been reopened for review."
      );
    } else {
      alert("Feedback submitted successfully!");
    }

    setSubmitted(true);
    onFeedbackSubmit?.(feedback);

    setTimeout(() => {
      setRating(0);
      setComment("");
      setPhoto(null);
      setPhotoPreview(null);
      setSubmitted(false);
      if (onClose) onClose();
    }, 1500);
  };

  // 🔹 Success message after submit
  if (submitted)
    return (
      <div className="p-6 bg-green-50 text-green-800 rounded-2xl shadow-md flex flex-col items-center gap-2 text-center animate-fade-in">
        <FaCheckCircle className="text-3xl text-green-600" />
        <p className="font-semibold">Feedback submitted successfully!</p>
        <small className="text-gray-500 text-sm">Closing in a moment...</small>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto space-y-5 animate-fade-in border border-blue-300"
    >
      <h3 className="text-2xl font-bold text-center text-blue-700">
        Leave Your Feedback (Round {feedbackRound})
      </h3>

      <div className="bg-blue-50 p-3 rounded-lg text-gray-700 border border-blue-200">
        <p><strong>User Name:</strong> {userName}</p>
        <p><strong>Department:</strong> {deptName}</p>
      </div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <FaStar
            key={num}
            onClick={() => setRating(num)}
            onMouseEnter={() => setHoverRating(num)}
            onMouseLeave={() => setHoverRating(0)}
            className={`cursor-pointer text-3xl transition-colors duration-200 ${
              (hoverRating || rating) >= num
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
            title={`${num} Star${num > 1 ? "s" : ""}`}
          />
        ))}
      </div>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={4}
      />

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-600 font-medium cursor-pointer">
          <FaUpload /> Upload photo (optional)
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>

        {photoPreview && (
          <div className="mt-2">
            <img
              src={photoPreview}
              alt="Uploaded preview"
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!rating}
          className={`flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            rating
              ? "bg-blue-600 hover:bg-blue-700 shadow-md"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit Feedback
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
