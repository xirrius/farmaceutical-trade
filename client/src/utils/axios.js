import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://farmaceutical-trade.onrender.com",
  timeout: 60000,
});

const authInstance = axios.create({
  baseURL: "https://farmaceutical-trade.onrender.com",
  timeout: 10000,
});

authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance, authInstance };
