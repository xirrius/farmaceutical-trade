import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

const authInstance = axios.create({
  baseURL: "http://localhost:5000",
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
