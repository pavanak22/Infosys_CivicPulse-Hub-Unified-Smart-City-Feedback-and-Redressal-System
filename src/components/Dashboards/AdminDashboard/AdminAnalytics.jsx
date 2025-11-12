import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FaSearch } from "react-icons/fa";

export default function AdminAnalytics() {
  const [complaints, setComplaints] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  // 🎨 Status colors (Open, Assigned, Closed)
  const STATUS_COLORS = {
    Open: "#ef4444", // red
    Assigned: "#f59e0b", // orange
    Closed: "#22c55e", // green
  };

  // 🔹 Load complaints and convert "Resolved" → "Assigned"
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("complaints") || "[]");

    const updated = data.map((c) =>
      c.status === "Resolved" ? { ...c, status: "Assigned" } : c
    );

    setComplaints(updated);
  }, []);

  // 🔹 Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesDept =
      selectedDept === "All" ||
      c.department === selectedDept ||
      c.dept === selectedDept;

    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesSearch;
  });

  // 🔸 Only Open, Assigned, Closed statuses
  const statusMap = { Open: 0, Assigned: 0, Closed: 0 };
  filteredComplaints.forEach((c) => {
    const st = c.status;
    if (statusMap[st] !== undefined) statusMap[st]++;
  });

  const statusData = Object.keys(statusMap).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  // 🔸 Department Data
  const deptMap = {};
  filteredComplaints.forEach((c) => {
    const dept = c.department || c.dept || "Unknown";
    if (!deptMap[dept]) deptMap[dept] = 0;
    deptMap[dept]++;
  });

  const deptData = Object.keys(deptMap).map((key) => ({
    name: key,
    value: deptMap[key],
  }));

  const selectedStatusData = selectedStatus
    ? filteredComplaints.filter((c) => c.status === selectedStatus)
    : filteredComplaints;

  const progressData = selectedStatus
    ? [
        {
          name: selectedStatus,
          count: selectedStatusData.length,
        },
      ]
    : statusData;

  const departments = [
    "All",
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

  return (
    <div className="analytics-page">
      <h1 className="title">📊 Admin Analytics Dashboard</h1>

      {/* 🔽 Filters Section */}
      <div className="filters">
        <div className="filter-item">
          <label>Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 🔍 Search bar */}
        <div className="filter-item search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 🏢 Department Chart */}
      <div className="chart-section">
        <h3>🏢 Complaints by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Complaint Status Overview */}
      <div className="chart-section">
        <h3>📊 Complaint Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              label
              outerRadius={100}
              onClick={(entry) =>
                setSelectedStatus(
                  selectedStatus === entry.name ? null : entry.name
                )
              }
            >
              {statusData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={STATUS_COLORS[entry.name] || "#ccc"}
                  style={{
                    cursor: "pointer",
                    opacity:
                      !selectedStatus || selectedStatus === entry.name
                        ? 1
                        : 0.3,
                  }}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* ✅ When clicked, show bar chart below */}
        {selectedStatus && (
          <div className="chart-section">
            <h4 style={{ color: STATUS_COLORS[selectedStatus] }}>
              Progress for: {selectedStatus}
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill={STATUS_COLORS[selectedStatus] || "#00eaff"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .analytics-page {
          padding: 25px;
          color: #fff;
          background: radial-gradient(circle at top, #0a0a1a, #000);
          border-radius: 16px;
          text-align: center;
        }
        .title {
          color: #00eaff;
          text-shadow: 0 0 15px #00eaff;
          margin-bottom: 25px;
        }
        .filters {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        select {
          background: #111;
          color: #00eaff;
          border: 1px solid #00eaff55;
          border-radius: 6px;
          padding: 6px 10px;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: #111;
          padding: 5px 10px;
          border-radius: 8px;
          border: 1px solid #00eaff55;
        }
        .search-icon {
          color: #00eaff;
          margin-right: 6px;
        }
        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          width: 200px;
        }
        .chart-section {
          margin-top: 30px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 0 15px #00eaff22;
        }
        h3 {
          color: #00eaff;
          margin-bottom: 15px;
        }
        h4 {
          margin-top: 15px;
          text-shadow: 0 0 10px #00eaff;
        }
      `}</style>
    </div>
  );
}
