import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DepartmentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials for testing
    const validEmail = "dept@example.com";
    const validPassword = "123456";

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    if (email === validEmail && password === validPassword) {
      // Simulate successful login
      localStorage.setItem("loggedDept", JSON.stringify({ email }));
      navigate("/department-dashboard");
    } else {
      setError("Invalid email or password!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5" }}>
      <form
        onSubmit={handleLogin}
        style={{
          padding: "40px",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2>Department Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "15px 0", padding: "10px", width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "15px 0", padding: "10px", width: "100%" }}
        />

        {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px", width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}
