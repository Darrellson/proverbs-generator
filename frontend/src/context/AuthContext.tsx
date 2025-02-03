import React, { createContext, ReactNode, useContext, useState } from "react";

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
  const [token, setTokenState] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const setToken = (newToken: string | null, admin: boolean) => {
    if (newToken) {
      setTokenState(newToken);
      setIsAdmin(admin);
    } else {
      setTokenState(null);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    setToken(null, false);
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
