import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile, logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        console.log("Profile loaded:", data.user);
        setUser(data.user);
      })
      .catch(() => {
        console.log("Profile fetch failed, keeping existing user");
      })
      .finally(() => setLoading(false));
  }, []);

  function login(userData, token) {
    if (token) localStorage.setItem("token", token);
    console.log("Setting user from login:", userData);
    setUser(userData);
  }

  async function logout() {
    try {
      await logoutUser();
      localStorage.removeItem("token");
    } catch (_) { }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: false,
      login: () => { },
      logout: () => { },
    };
  }
  return context;
}