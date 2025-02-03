import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string | null, admin: boolean) => void;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState<boolean>(JSON.parse(localStorage.getItem("isAdmin") || "false"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
    }
  }, [token, isAdmin]);

  const setToken = (newToken: string | null, admin: boolean) => {
    if (newToken) {
      setTokenState(newToken);
      setIsAdmin(admin);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      setTokenState(null);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    setToken(null, false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
