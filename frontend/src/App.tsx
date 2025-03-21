import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Proverbs from "./pages/Proverbs";
import AdminPanel from "./pages/adminpanel";
import AuthForm from "./pages/AuthForm";
import Logout from "./components/Logout";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm isRegistering={false} />} />
          <Route path="/register" element={<AuthForm isRegistering={true} />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/proverbs" element={<ProtectedRoute><Proverbs /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
