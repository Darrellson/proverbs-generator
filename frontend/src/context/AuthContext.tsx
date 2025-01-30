import React, { createContext, useState, useContext, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string | null, admin: boolean) => void; // Updated type
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState<boolean>(
    JSON.parse(localStorage.getItem("isAdmin") || "false")
  );

  const updateToken = (newToken: string | null, admin: boolean) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("isAdmin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    }
    setToken(newToken);
    setIsAdmin(admin);
  };

  const logout = () => {
    updateToken(null, false);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, setToken: updateToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
