import React, { createContext, useContext, useEffect, useState } from "react";
import { getDB, saveDB, generateId } from "./mockData";

const AuthCtx = createContext(null);
const SESSION_KEY = "crm360_session_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDB(); // ensure seeded
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
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

  const login = (email, password) => {
    const db = getDB();
    const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: "Invalid email or password" };
    if (found.status !== "active") return { ok: false, error: "Account inactive. Contact admin." };
    const session = { id: found.id, name: found.name, email: found.email, role: found.role, avatar: found.avatar };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true, user: session };
  };

  const signup = ({ name, email, password, role }) => {
    const db = getDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Email already registered" };
    }
    const newUser = {
      id: generateId("u"),
      name,
      email,
      password,
      role,
      avatar: name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      status: "active",
      phone: "",
      joined: new Date().toISOString().slice(0, 10),
    };
    db.users.push(newUser);
    saveDB(db);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true, user: session };
  };

  const logout = () => {
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
