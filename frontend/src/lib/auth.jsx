import React, { createContext, useContext, useEffect, useState } from "react";
import { getDB, saveDB, generateId } from "./mockData";
import socket from "../services/socket";
import API from "../api/axios";

const AuthCtx = createContext(null);
const SESSION_KEY = "crm360_session_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDB(); // ensure seeded
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { }
    }
    // Apply saved accent color
    const savedAccent = localStorage.getItem("crm360_accent");
    const accentMap = {
      "#10B981": "158 84% 39%",
      "#3B82F6": "217 91% 60%",
      "#F59E0B": "43 96% 58%",
      "#A855F7": "280 84% 65%",
      "#EF4444": "0 72% 51%",
    };
    if (savedAccent && accentMap[savedAccent]) {
      const hue = accentMap[savedAccent];
      const root = document.documentElement;
      root.style.setProperty("--primary", hue);
      root.style.setProperty("--accent", hue);
      root.style.setProperty("--ring", hue);
      root.style.setProperty("--chart-1", hue);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      const session = {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      setUser(session);
      socket.connect();

      socket.emit(
        "join",
        session.id
      );

      return {
        ok: true,
        user: session,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async ({ name, email, password, role }) => {
    try {

      const roleMap = {
        admin: "admin",
        sales_manager: "sales_manager",
        sales_executive: "sales_executive",
      };

      const res = await API.post("/auth/register", {
        fullName: name,
        email,
        password,
        role: roleMap[role],
      });

      const user = res.data.user;

      const session = {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      };

      setUser(session);
      socket.connect();

      socket.emit(
        "join",
        session.id
      );
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return {
        ok: true,
        user: session,
      };

    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Registration Failed",
      };
    }
  };
  const logout = () => {

    socket.disconnect();

    localStorage.removeItem(SESSION_KEY);

    setUser(null);

  };

  const updateProfile = (updates) => {
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      db.users[idx] = { ...db.users[idx], ...updates };
      saveDB(db);
      const session = { ...user, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
