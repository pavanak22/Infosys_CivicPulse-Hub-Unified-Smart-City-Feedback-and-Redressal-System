import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Pages
import LoginSelection from "./components/Auth/LoginSelection.jsx";
import UserLogin from "./components/Auth/UserLogin.jsx";
import Register from "./components/Auth/Register.jsx";
import AdminLogin from "./components/Auth/AdminLogin.jsx";
import DepartmentLogin from "./components/Auth/DepartmentLogin.jsx";

// Dashboards
import UserDashboard from "./components/Dashboards/UserDashboard/UserDashboard.jsx";
import AdminDashboard from "./components/Dashboards/AdminDashboard/AdminDashboard.jsx";
import DepartmentDashboard from "./components/Dashboards/DepartmentDashboard/DepartmentDashboard.jsx";

function App() {
  return (
    // 👇 Add basename to make all routes work on GitHub Pages
    <Router basename="/Infosys_CivicPulse-Hub-Unified-Smart-City-Feedback-and-Redressal-System">
      <Routes>
        {/* ======================= Public Routes ======================= */}
        <Route path="/" element={<LoginSelection />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/department-login" element={<DepartmentLogin />} />

        {/* ======================= Dashboards ======================= */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/department-dashboard" element={<DepartmentDashboard />} />

        {/* ======================= Fallback Route ======================= */}
        <Route path="*" element={<LoginSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
