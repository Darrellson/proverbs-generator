import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [proverbs, setProverbs] = useState<{ id: number; beginning: string; ending: string }[]>([]);
  const [newProverb, setNewProverb] = useState({ beginning: "", ending: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      setError("No token provided. Please log in.");
      return;
    }

    setLoading(true);
    console.log("🔍 Sending Token:", token); // Debug Token

    axios
      .get(`${VITE_API_URL}/proverbs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ API Response:", res.data); // Debug response format
        if (Array.isArray(res.data)) {
          setProverbs(res.data);
          setError(null);
        } else {
          setError(`🚨 Unexpected API response format: ${JSON.stringify(res.data)}`);
        }
      })
      .catch((err) => {
        setError("Error fetching proverbs.");
        console.error("❌ Error fetching proverbs:", err);
      })
      .finally(() => setLoading(false));
  }, [token, VITE_API_URL]);

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

      {proverbs.length > 0 ? (
        <div className="row mb-4">
          <div className="col-md-8 mx-auto">
            <h4 className="text-center">Proverbs List</h4>
            <ul className="list-group">
              {proverbs.map((proverb) => (
                <li key={proverb.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{proverb.beginning}</strong> - {proverb.ending}
                  </div>
                  <button onClick={() => handleDelete(proverb.id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center">No proverbs available. Please add one!</p>
      )}

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
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleAddProverb}>Add Proverb</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
