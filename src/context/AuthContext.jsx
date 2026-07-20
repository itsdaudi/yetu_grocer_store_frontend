// AuthContext — manages the logged-in user and JWT across the whole app.
// Any component can read the current user or call login/logout via
// the useAuth() hook, without passing props down through every page.

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on first load, check if we already have a token saved and,
  // if so, fetch the current user so a page refresh doesn't log you out
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    apiClient
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        // token was invalid/expired — clear it
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.access_token);
    setUser(response.data.user);
  };

  const signup = async (name, email, password) => {
    const response = await apiClient.post("/auth/signup", { name, email, password });
    localStorage.setItem("token", response.data.access_token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so components can just call useAuth() instead of
// importing useContext and AuthContext separately every time
export function useAuth() {
  return useContext(AuthContext);
}