import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  isRegistering: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); 
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Redirect authenticated users
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/proverbs");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isRegistering ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;

    try {
      const payload = isRegistering
        ? { name: name.trim(), email: email.toLowerCase().trim(), password, isAdmin } // Include isAdmin
        : { email: email.toLowerCase().trim(), password };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (isRegistering) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else if (response.data.accessToken) {
        login(response.data.accessToken, response.data.isAdmin);
        navigate("/proverbs");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || (isRegistering ? "Registration failed" : "Login failed"));
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container card p-4 shadow-sm mt-5">
      <h3 className="text-center">{isRegistering ? "Register" : "Login"}</h3>
      {isRegistering && (
        <>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="adminCheck"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="adminCheck">
              Register as Admin
            </label>
          </div>
        </>
      )}
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
