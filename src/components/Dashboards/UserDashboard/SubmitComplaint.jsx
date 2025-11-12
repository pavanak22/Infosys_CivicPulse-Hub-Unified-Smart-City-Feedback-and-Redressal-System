import React, { useState } from "react";

export default function SubmitComplaint() {
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

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    priority: "Medium",
    dept: "",
    photo: "",
  });

  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length <= 200) {
      setCharCount(value.length);
    }
    setForm({ ...form, [name]: value });
  };

  // 📸 Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, photo: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.description.length < 10) {
      setError("⚠️ Description must be at least 10 characters long.");
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      alert("Please login first!");
      return;
    }

    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");

    const newComplaint = {
      id: Date.now(),
      ...form,
      userEmail: loggedInUser.email,
      userName: loggedInUser.name || "Anonymous",
      status: "Open",
      timestamp: new Date().toLocaleString(),
      lastUpdated: new Date().toLocaleString(),
    };

    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    setSuccess(true);
    setError("");
    setForm({
      title: "",
      description: "",
      location: "",
      priority: "Medium",
      dept: "",
      photo: "",
    });
    setPreview(null);
    setCharCount(0);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="complaint-container">
      <h2 className="title">📝 Submit a Complaint</h2>

      {success && <div className="success-msg">✅ Complaint Submitted Successfully!</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Title */}
        <input
          name="title"
          placeholder="Complaint Title"
          value={form.title}
          onChange={handleChange}
          required
          className="input"
        />

        {/* Location */}
        <input
          name="location"
          placeholder="Enter your location / area"
          value={form.location}
          onChange={handleChange}
          required
          className="input"
        />

        {/* 🔹 Department Dropdown */}
        <select
          name="dept"
          value={form.dept}
          onChange={handleChange}
          required
          className="input select-glow"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Priority */}
        <div className="priority">
          <label>Priority:</label>
          {["Low", "Medium", "High"].map((p) => (
            <label key={p}>
              <input
                type="radio"
                name="priority"
                value={p}
                checked={form.priority === p}
                onChange={handleChange}
              />{" "}
              {p}
            </label>
          ))}
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe your issue (min 10 chars, max 200)..."
          value={form.description}
          onChange={handleChange}
          required
          rows="5"
          className="textarea"
        />
        <div
          className="char-count"
          style={{ color: charCount < 10 ? "red" : "#ccc" }}
        >
          {charCount}/200 characters
        </div>

        {/* 📸 Photo Upload */}
        <div className="photo-upload">
          <label className="photo-label">📷 Upload Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="file-input"
          />
          {preview && <img src={preview} alt="preview" className="preview" />}
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn">
          Submit Complaint
        </button>
      </form>

      <style jsx="true">{`
        .complaint-container {
          background: rgba(10, 15, 20, 0.9);
          border-radius: 18px;
          padding: 35px;
          max-width: 600px;
          margin: 40px auto;
          box-shadow: 0 0 20px rgba(0, 234, 255, 0.3);
          border: 1px solid rgba(0, 234, 255, 0.5);
          font-family: "Poppins", sans-serif;
          color: #fff;
        }
        .title {
          color: #00eaff;
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 20px;
          text-shadow: 0 0 10px #00eaff;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .input,
        .textarea,
        select {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(0, 234, 255, 0.4);
          padding: 12px;
          font-size: 1rem;
          color: #fff;
          outline: none;
          transition: all 0.3s ease;
        }
        .input:focus,
        .textarea:focus,
        select:focus {
          box-shadow: 0 0 15px #00eaffaa;
          border-color: #00eaff;
        }
        .select-glow {
          color: #fff;
          background-color: rgba(0, 0, 0, 0.6);
        }
        .priority {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.95rem;
          color: #ddd;
        }
        .char-count {
          text-align: right;
          font-size: 0.8rem;
        }
        .photo-upload {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .photo-label {
          color: #00eaff;
          font-weight: 500;
        }
        .file-input {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(0, 234, 255, 0.4);
        }
        .preview {
          margin-top: 10px;
          border-radius: 12px;
          max-height: 150px;
          border: 1px solid rgba(0, 234, 255, 0.4);
          box-shadow: 0 0 15px #00eaff55;
        }
        .btn {
          background: linear-gradient(90deg, #00eaff, #007bff);
          border: none;
          color: #fff;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px #00eaff55;
        }
        .btn:hover {
          box-shadow: 0 0 25px #00eaffaa;
          transform: scale(1.03);
        }
        .error {
          color: #ff6666;
          text-align: center;
          font-weight: 500;
        }
        .success-msg {
          background: rgba(0, 255, 128, 0.15);
          border: 1px solid #00ff99;
          color: #00ffcc;
          text-align: center;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 15px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
