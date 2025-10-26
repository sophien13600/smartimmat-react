import { createContext, useEffect, useState } from "react";

// 1. Création du contexte
export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  logout: () => {},
});

// 2. Création du provider
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Hydrate from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {
        setUser(null);
      }
    }
  }, []);

  // Persist token and user
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("user", JSON.stringify(user));
  }, [token, isAuthenticated, user]);

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", "false");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};