import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://localhost:4000/api"
      : "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("session_id");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
