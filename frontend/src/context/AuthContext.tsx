import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import axios from "axios";

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  login: (accessToken: string, isAdmin: boolean) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState<boolean>(JSON.parse(localStorage.getItem("isAdmin") || "false"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    }
  }, [token, isAdmin]);

  const login = (accessToken: string, admin: boolean) => {
    setToken(accessToken);
    setIsAdmin(admin);
  };

  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
    setToken(null);
    setIsAdmin(false);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
      }
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
