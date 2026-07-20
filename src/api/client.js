// Centralized axios instance for talking to the Flask backend.
// Every page imports this instead of using raw axios/fetch directly,
// so the base URL and auth token logic only need to be set up once.

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// automatically attach the JWT (if we have one) to every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;