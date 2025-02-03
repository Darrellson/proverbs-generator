import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

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
  const [token, setTokenState] = useState<string | null>(Cookies.get("token") || null);
  const [isAdmin, setIsAdmin] = useState<boolean>(JSON.parse(Cookies.get("isAdmin") || "false"));

  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 7 }); // Set cookie for 7 days
      Cookies.set("isAdmin", JSON.stringify(isAdmin), { expires: 7 });
    } else {
      Cookies.remove("token");
      Cookies.remove("isAdmin");
    }
  }, [token, isAdmin]);

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
