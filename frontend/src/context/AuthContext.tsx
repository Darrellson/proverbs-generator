import axios from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  login: (accessToken: string, isAdmin: boolean) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setAdminState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

  // Set admin state by checking if the user is an admin from the backend
  const setAdminState = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/isAdmin`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      if (error.response?.status === 401) {
        setIsAdmin(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout, refreshAccessToken, setAdminState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
