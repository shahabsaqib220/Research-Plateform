// services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the correct token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get tokens from localStorage
    const headUserToken = localStorage.getItem('authToken'); // Head User token
    const groupMemberToken = localStorage.getItem('groupMemberToken'); // Group Member token

    // Attach Head User token if available
    if (headUserToken) {
      config.headers.Authorization = `Bearer ${headUserToken}`;
    }
    // Attach Group Member token if available
    else if (groupMemberToken) {
      config.headers.Authorization = `Bearer ${groupMemberToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (token issues)
      console.error("Unauthorized - Please login again");
      // You can redirect to the login page or trigger logout logic here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;