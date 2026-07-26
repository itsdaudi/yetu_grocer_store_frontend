// Centralized axios instance for talking to the Flask backend.
// Every page imports this instead of using raw axios/fetch directly,
// so the base URL and auth token logic only need to be set up once.

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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