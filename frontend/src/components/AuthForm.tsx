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
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Redirect authenticated users
  useEffect(() => {
    if (token) {
      navigate("/proverbs");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = `${API_URL}/auth/login`;

    try {
      const response = await axios.post(
        url,
        {
          email: email.toLowerCase().trim(),
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.token) {
        setToken(response.data.token);
        navigate("/proverbs");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Login failed");
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
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
