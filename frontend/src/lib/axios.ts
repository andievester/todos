import axios from "axios";
import { toast } from "sonner";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5185/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwt_token");

      toast.error("Session expired", {
        description: "Please log in again to continue.",
      });

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
