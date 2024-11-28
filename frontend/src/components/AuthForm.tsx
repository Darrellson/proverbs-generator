import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  isRegistering: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegistering }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `http://localhost:5000/auth/${isRegistering ? 'register' : 'login'}`;
    try {
      const response = await axios.post(url, { email, password });
      if (response.data.token) {
        setToken(response.data.token);
        navigate('/proverbs'); // Redirect to the proverbs page after login
      } else {
        alert('Invalid credentials');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert('Error: ' + error.response?.data?.error || 'Something went wrong');
      } else {
        alert('Error: Something went wrong');
      }
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <h3 className="text-center">{isRegistering ? 'Register' : 'Login'}</h3>
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
        <button type="submit" className="btn btn-primary w-100">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
