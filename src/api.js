// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://fastapi-macro-tracker.onrender.com", // Your deployed FastAPI
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // <-- must be 'Bearer <token>'
  }
  return req;
});

export default API;