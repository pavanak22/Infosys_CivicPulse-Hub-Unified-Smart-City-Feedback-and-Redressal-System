// src/api/api.js
import axios from "axios";

// =================== BASE SETUP ===================
const API_URL = "http://localhost:5000"; // 🔹 Backend URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Helper to attach token if available
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔹 Centralized request handler for consistent error management
const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error("⚠️ API Error:", error.response?.data || error.message);
    throw error;
  }
};

// =================================================
// =================== USER APIs ===================
// =================================================

export const registerUser = (userData) =>
  handleRequest(() => api.post("/register", userData));

export const loginUser = (userData) =>
  handleRequest(() => api.post("/login", userData));

// =================================================
// ================== COMPLAINT APIs ===============
// =================================================

export const submitComplaint = (complaintData) =>
  handleRequest(() =>
    api.post("/complaints/create", complaintData, { headers: authHeader() })
  );

export const getAllComplaints = () =>
  handleRequest(() => api.get("/complaints", { headers: authHeader() }));

export const getUserComplaints = (userId) =>
  handleRequest(() =>
    api.get(`/complaints/user/${userId}`, { headers: authHeader() })
  );

export const getDepartmentComplaints = (departmentId) =>
  handleRequest(() =>
    api.get(`/complaints/department/${departmentId}`, { headers: authHeader() })
  );

export const updateComplaint = (complaintId, updatedData) =>
  handleRequest(() =>
    api.put(`/complaints/${complaintId}`, updatedData, {
      headers: authHeader(),
    })
  );

export const closeComplaint = (complaintId) =>
  handleRequest(() =>
    api.put(`/complaints/${complaintId}/close`, {}, { headers: authHeader() })
  );

// =================================================
// ================= COMMUNITY APIs ===============
// =================================================

export const createCommunityPost = (postData) =>
  handleRequest(() => api.post("/community", postData, { headers: authHeader() }));

export const getCommunityPosts = () =>
  handleRequest(() => api.get("/community", { headers: authHeader() }));

// =================================================
// ================== ADMIN APIs ===================
// =================================================

export const loginAdmin = (adminData) =>
  handleRequest(() => api.post("/admin/login", adminData));

// =================================================
// ================== DEPARTMENT AUTH ===============
// =================================================

export const loginDepartment = (deptData) =>
  handleRequest(() => api.post("/department/login", deptData));

// =================================================
// ========= DEPARTMENT MANAGEMENT APIs =============
// =================================================

// 🔹 Get all departments
export const getDepartments = () =>
  handleRequest(() => api.get("/departments", { headers: authHeader() }));

// 🔹 Add a new department
export const addDepartment = (deptData) =>
  handleRequest(() =>
    api.post("/departments", deptData, { headers: authHeader() })
  );

// 🔹 Update an existing department
export const updateDepartment = (deptId, updatedData) =>
  handleRequest(() =>
    api.put(`/departments/${deptId}`, updatedData, { headers: authHeader() })
  );

// 🔹 Delete a department
export const deleteDepartment = (deptId) =>
  handleRequest(() =>
    api.delete(`/departments/${deptId}`, { headers: authHeader() })
  );

// =================================================
// ========= OPTIONAL: EMPLOYEE MANAGEMENT APIs =====
// =================================================

// 🔹 Get employees by department
export const getEmployeesByDept = (deptId) =>
  handleRequest(() =>
    api.get(`/departments/${deptId}/employees`, { headers: authHeader() })
  );

// 🔹 Add employee to a department
export const addEmployee = (deptId, empData) =>
  handleRequest(() =>
    api.post(`/departments/${deptId}/employees`, empData, { headers: authHeader() })
  );

// 🔹 Update employee
export const updateEmployee = (empId, empData) =>
  handleRequest(() =>
    api.put(`/employees/${empId}`, empData, { headers: authHeader() })
  );

// 🔹 Delete employee
export const deleteEmployee = (empId) =>
  handleRequest(() =>
    api.delete(`/employees/${empId}`, { headers: authHeader() })
  );

