// axiosConfig.ts
import axios, { AxiosInstance } from "axios";
import AuthStorage from "../utils/AuthStorage";

const api = "http://192.168.215.77:8000";

const axiosInstance = axios.create({
  baseURL: api,
});

export default axiosInstance;

export const authorizedApi: AxiosInstance = axios.create({
  baseURL: api,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

authorizedApi.interceptors.request.use(
  async (config) => {
    const token = await AuthStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
