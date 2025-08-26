// src/services/api.js
import axios from "axios";
import {toast} from "react-toastify";
import error = toast.error;

const API_BASE_URL = "https://localhost:7275/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// @ts-ignore

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
    (error) => Promise.reject(error)

);
