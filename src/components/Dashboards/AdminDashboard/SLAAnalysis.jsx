import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function SLA() {
  const [complaints, setComplaints] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [daysFilter, setDaysFilter] = useState("All");

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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(stored);
  }, []);

  // ✅ SLA scoring logic
  const getPoints = (days) => {
    if (days <= 10) return 100;
    if (days <= 15) return 90;
    if (days <= 20) return 80;
    if (days <= 25) return 70;
    if (days <= 30) return 60;
    return 30;
  };

  // ✅ Use manually entered daysTaken for SLA
  const processed = complaints.map((c) => {
    if (c.status !== "Closed") {
      return { ...c, slaDays: 0, slaPoints: 0 };
    }

    const daysTaken = Number(c.daysTaken) || 0; // ✅ New: using department-entered value
    const points = getPoints(daysTaken);

    return { ...c, slaDays: daysTaken, slaPoints: points };
  });

  // ✅ Apply filters
  const filteredComplaints = processed.filter((c) => {
    let deptMatch = selectedDept === "All" || c.dept === selectedDept;
    let daysMatch =
      daysFilter === "All" ||
      (daysFilter === "<=10" && c.slaDays <= 10) ||
      (daysFilter === "<=20" && c.slaDays <= 20) ||
      (daysFilter === "<=30" && c.slaDays <= 30) ||
      (daysFilter === ">30" && c.slaDays > 30);
    return deptMatch && daysMatch;
  });

  // ✅ Department-wise averages
  const closedComplaints = processed.filter((c) => c.status === "Closed");
  const deptTotals = {};
  closedComplaints.forEach((c) => {
    if (!deptTotals[c.dept]) deptTotals[c.dept] = { total: 0, count: 0 };
    deptTotals[c.dept].total += c.slaPoints;
    deptTotals[c.dept].count += 1;
  });

  const deptAverages = Object.entries(deptTotals).map(([dept, data]) => ({
    dept,
    avg: (data.total / data.count).toFixed(2),
  }));

  // ✅ Pie chart data
  const COLORS = ["#00eaff", "#00ff88", "#ffdd00", "#ff6b6b", "#9b5de5"];
  const pieData = closedComplaints.map((c) => ({
    name: c.dept,
    value: c.slaPoints,
  }));

  // ✅ Summary
  const totalComplaints = complaints.length;
  const totalClosed = complaints.filter((c) => c.status === "Closed").length;
  const totalOpen = complaints.filter((c) => c.status !== "Closed").length;

  return (
    <div className="sla-container">
      <h2 className="sla-title">⚡ SLA (Service Level Agreement) Dashboard</h2>

      {/* 🔹 Filters */}
      <div className="filters">
        <div>
          <label>Filter by Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Filter by Days:</label>
          <select
            value={daysFilter}
            onChange={(e) => setDaysFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="<=10">≤ 10 Days</option>
            <option value="<=20">≤ 20 Days</option>
            <option value="<=30">≤ 30 Days</option>
            <option value=">30">&gt; 30 Days</option>
          </select>
        </div>
      </div>

      {/* 🔹 Summary Cards */}
      <div className="summary">
        <div className="card total">Total: {totalComplaints}</div>
        <div className="card closed">Closed: {totalClosed}</div>
        <div className="card open">Open: {totalOpen}</div>
      </div>

      {/* 🔹 Table */}
      <table className="sla-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dept</th>
            <th>Status</th>
            <th>Days Taken</th>
            <th>SLA Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No complaints found.
              </td>
            </tr>
          ) : (
            filteredComplaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.dept || "—"}</td>
                <td className={`status ${c.status.toLowerCase()}`}>{c.status}</td>
                <td>{c.status === "Closed" ? c.slaDays : "—"}</td>
                <td>{c.slaPoints}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔹 Average Points */}
      <h3 className="avg-title">📊 Department-wise Average SLA Points</h3>
      <table className="sla-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Avg SLA Points</th>
          </tr>
        </thead>
        <tbody>
          {deptAverages.map((a, i) => (
            <tr key={i}>
              <td>{a.dept}</td>
              <td>{a.avg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Pie Chart */}
      <h3 className="avg-title">🍩 SLA Points Distribution (Closed Complaints)</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Styling same as before */}
      <style jsx="true">{`
        .sla-container {
          background: #000814;
          color: white;
          padding: 30px;
          border-radius: 15px;
          border: 1px solid #00eaff55;
          box-shadow: 0 0 30px #00eaff22;
          font-family: "Poppins", sans-serif;
        }
        .sla-title {
          text-align: center;
          font-size: 2rem;
          color: #00eaff;
          text-shadow: 0 0 10px #00eaff;
          margin-bottom: 10px;
        }
        .filters {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
        }
        label {
          color: #00eaff;
          margin-right: 10px;
        }
        select {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #00eaff;
          background: #001f3f;
          color: white;
        }
        .summary {
          display: flex;
          justify-content: space-around;
          margin-bottom: 25px;
        }
        .card {
          padding: 15px 25px;
          border-radius: 10px;
          border: 1px solid #00eaff55;
          text-align: center;
        }
        .card.total {
          color: #00eaff;
        }
        .card.closed {
          color: #00ff88;
        }
        .card.open {
          color: #ff5555;
        }
        .sla-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        th,
        td {
          padding: 12px;
          border-bottom: 1px solid #00eaff22;
          text-align: center;
        }
        th {
          background: rgba(0, 234, 255, 0.1);
          color: #00eaff;
        }
        tr:hover {
          background: rgba(0, 234, 255, 0.05);
        }
        .status.closed {
          color: #00ff88;
        }
        .status.open {
          color: #ff5555;
        }
        .status.assigned {
          color: #00eaff;
        }
        .avg-title {
          text-align: center;
          color: #00eaff;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
