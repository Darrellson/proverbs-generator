import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminPanel: React.FC = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [proverbs, setProverbs] = useState<{ id: number; beginning: string; ending: string }[]>([]);
  const [newProverb, setNewProverb] = useState({ beginning: "", ending: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token || !isAdmin) {
      alert("Access Denied: Admins Only");
      navigate("/login");
      return;
    }

    setLoading(true);

    axios
      .get(`${VITE_API_URL}/proverbs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProverbs(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error fetching proverbs.");
      })
      .finally(() => setLoading(false));
  }, [token, isAdmin, navigate]);

  const handleDelete = (id: number) => {
    if (!token) return;

    axios
      .delete(`${VITE_API_URL}/proverbs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProverbs(proverbs.filter((proverb) => proverb.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting proverb:", err);
      });
  };

  const handleAddProverb = () => {
    if (!newProverb.beginning || !newProverb.ending || !token) return;

    axios
      .post(
        `${VITE_API_URL}/proverbs`,
        { beginning: newProverb.beginning, ending: newProverb.ending },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProverbs([...proverbs, res.data]);
        setNewProverb({ beginning: "", ending: "" });
      })
      .catch((err) => {
        console.error("Error adding proverb:", err);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel</h2>

      {loading && <p className="text-center">Loading proverbs...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <h4 className="text-center">Proverbs List</h4>
          <ul className="list-group">
            {proverbs.map((proverb) => (
              <li key={proverb.id} className="list-group-item">
                <strong>{proverb.beginning}</strong> - {proverb.ending}
                <button onClick={() => handleDelete(proverb.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center">Add New Proverb</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Beginning of Proverb"
            value={newProverb.beginning}
            onChange={(e) => setNewProverb({ ...newProverb, beginning: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Ending of Proverb"
            value={newProverb.ending}
            onChange={(e) => setNewProverb({ ...newProverb, ending: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAddProverb}>
            Add Proverb
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
