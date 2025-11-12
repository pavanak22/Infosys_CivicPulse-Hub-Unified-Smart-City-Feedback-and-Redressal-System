import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../App.css";

export default function Register() {
  const navigate = useNavigate();

  const initialForm = {
    role: "User",
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    departmentName: "",
    headName: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
      case "headName":
        if (!value || value.trim().length < 3) error = "Must be at least 3 characters";
        break;
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "password":
        if (!value || value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "phone":
        if (value && !/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
        break;
      case "departmentName":
        if (form.role === "Department" && !value.trim()) error = "Required for department";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
    setSuccessMessage("");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const fieldsToValidate =
      form.role === "Department"
        ? ["departmentName", "headName", "password"]
        : ["name", "email", "password", "phone", "address"];

    let isValid = true;
    fieldsToValidate.forEach((key) => {
      if (!validateField(key, form[key])) isValid = false;
    });
    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some((u) => u.email === form.email)) {
      setErrors({ email: "Email already registered!" });
      return;
    }

    const newUser = { ...form, id: Date.now(), joined: new Date().toLocaleDateString() };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    setSuccessMessage(`Registered successfully as ${form.role}!`);

    const currentRole = form.role;
    setForm(initialForm);

    setTimeout(() => {
      if (currentRole === "User") navigate("/user-dashboard");
      else if (currentRole === "Admin") navigate("/admin-dashboard");
      else navigate("/department-dashboard");
    }, 1200);
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };
  const errorStyle = {
    color: "red",
    fontSize: "0.85rem",
    marginTop: "-10px",
    marginBottom: "10px",
  };
  const successStyle = {
    color: "green",
    fontSize: "0.95rem",
    textAlign: "center",
    marginBottom: "10px",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // ✅ scroll works properly
        background: "#f5f5f5",
        padding: "40px 20px",
        minHeight: "100vh",
        overflowY: "auto", // ✅ enables scroll
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
          width: "450px",
          padding: "30px 25px",
          margin: "20px 0", // ✅ replaced margin: auto
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #4e8ef7, #2b6ce4)",
            color: "#fff",
            padding: "20px",
            borderRadius: "16px 16px 0 0",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0 }}>Register</h2>
          <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
            Create your account to get started
          </p>
        </div>

        {successMessage && <div style={successStyle}>{successMessage}</div>}

        <form
          onSubmit={handleRegister}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            textAlign: "left",
          }}
        >
          <label>Account Type</label>
          <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Department">Department</option>
          </select>

          {(form.role === "User" || form.role === "Admin") && (
            <>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </>
          )}

          {form.role === "Department" && (
            <>
              <label>Department Name</label>
              <input
                type="text"
                name="departmentName"
                placeholder="Enter department name"
                value={form.departmentName}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.departmentName && (
                <span style={errorStyle}>{errors.departmentName}</span>
              )}

              <label>Head Name</label>
              <input
                type="text"
                name="headName"
                placeholder="Enter head of department"
                value={form.headName}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.headName && <span style={errorStyle}>{errors.headName}</span>}

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Set a password"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.password && <span style={errorStyle}>{errors.password}</span>}
            </>
          )}

          {(form.role === "User" || form.role === "Admin") && (
            <>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.email && <span style={errorStyle}>{errors.email}</span>}

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.password && <span style={errorStyle}>{errors.password}</span>}

              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.phone && <span style={errorStyle}>{errors.phone}</span>}

              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={form.address}
                onChange={handleChange}
                style={inputStyle}
              />
            </>
          )}

          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(90deg, #4e8ef7, #2b6ce4)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{ color: "#4e8ef7", textDecoration: "none", fontWeight: "500" }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
