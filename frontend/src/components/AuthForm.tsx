import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  isRegistering: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = `${API_URL}/auth/login`;
  
    try {
      console.log('Login Attempt:', {
        email,
        passwordLength: password.length,
        apiUrl: url
      });
  
      const response = await axios.post(
        url,
        {
          email: email.toLowerCase().trim(), // Normalize email
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true // Add if using cookies
        }
      );
  
      console.log('Login Response:', response.data);
  
      if (response.data.token) {
        setToken(response.data.token);
        navigate("/proverbs");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Detailed Login Error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        alert(error.response?.data?.error || "Login failed");
      } else {
        console.error('Unexpected Login Error:', error);
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
