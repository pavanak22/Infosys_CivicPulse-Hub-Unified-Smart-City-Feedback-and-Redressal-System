// src/api/api.js
import axios from "axios";

// Base API instance
const API_URL = "http://localhost:5000"; // backend URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Helper to attach token if available
const authHeader = () => {
  const token = localStorage.getItem("token"); // assuming JWT is stored in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Centralized request handler
const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// =================== USER APIs ===================
export const registerUser = (userData) =>
  handleRequest(() => api.post("/register", userData));

export const loginUser = (userData) =>
  handleRequest(() => api.post("/login", userData));

// ================== COMPLAINT APIs ==================
export const submitComplaint = (complaintData) =>
  handleRequest(() =>
    api.post("/complaints/create", complaintData, { headers: authHeader() })
  );

export const getAllComplaints = () =>
  handleRequest(() => api.get("/complaints", { headers: authHeader() }));

export const getUserComplaints = (userId) =>
  handleRequest(() => api.get(`/complaints/user/${userId}`, { headers: authHeader() }));

export const getDepartmentComplaints = (departmentId) =>
  handleRequest(() => api.get(`/complaints/department/${departmentId}`, { headers: authHeader() }));

export const updateComplaint = (complaintId, updatedData) =>
  handleRequest(() =>
    api.put(`/complaints/${complaintId}`, updatedData, { headers: authHeader() })
  );

export const closeComplaint = (complaintId) =>
  handleRequest(() =>
    api.put(`/complaints/${complaintId}/close`, {}, { headers: authHeader() })
  );

// ================== COMMUNITY APIs ==================
export const createCommunityPost = (postData) =>
  handleRequest(() => api.post("/community", postData, { headers: authHeader() }));

export const getCommunityPosts = () =>
  handleRequest(() => api.get("/community", { headers: authHeader() }));

// ================== ADMIN APIs ==================
export const loginAdmin = (adminData) =>
  handleRequest(() => api.post("/admin/login", adminData));

// ================== DEPARTMENT APIs ==================
export const loginDepartment = (deptData) =>
  handleRequest(() => api.post("/department/login", deptData));
