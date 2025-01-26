import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [proverbs, setProverbs] = useState<{ beginning: string; ending: string; id: number }[]>([]);
  const [newProverb, setNewProverb] = useState({ beginning: "", ending: "" });
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      console.log('Token exists:', token);
      console.log('API URL:', VITE_API_URL);
      axios
        .get(`${VITE_API_URL}/proverbs`, { headers: { Authorization: token } })
        .then((res) => setProverbs(res.data))
        .catch((err) => console.error("Error fetching proverbs:", err));
    }
  }, [token, VITE_API_URL]);
  

  const handleDelete = (id: number) => {
    if (token) {
      axios
        .delete(`${VITE_API_URL}/proverbs/${id}`, { headers: { Authorization: token } })
        .then(() => {
          setProverbs(proverbs.filter((proverb) => proverb.id !== id));
        })
        .catch((err) => console.error("Error deleting proverb:", err));
    }
  };

  const handleAddProverb = () => {
    if (newProverb.beginning && newProverb.ending && token) {
      axios
        .post(
          `${VITE_API_URL}/proverbs/`,  // Ensure correct endpoint
          { beginning: newProverb.beginning, ending: newProverb.ending },
          { headers: { Authorization: `Bearer ${token}` } }  // Add 'Bearer'
        )
        .then((res) => {
          setProverbs([...proverbs, res.data]);
          setNewProverb({ beginning: "", ending: "" });
        })
        .catch((err) => console.error("Error adding proverb:", err));
    }
  };
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel</h2>

      {/* Display Proverbs in two columns */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4 className="text-center">Beginning of Proverbs</h4>
          <ul className="list-group">
            {proverbs.map((proverb) => (
              <li key={proverb.id} className="list-group-item d-flex justify-content-between align-items-center">
                {proverb.beginning}
                <button
                  onClick={() => handleDelete(proverb.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h4 className="text-center">Ending of Proverbs</h4>
          <ul className="list-group">
            {proverbs.map((proverb) => (
              <li key={proverb.id} className="list-group-item d-flex justify-content-between align-items-center">
                {proverb.ending}
                <button
                  onClick={() => handleDelete(proverb.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add New Proverb Form */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center">Add New Proverb</h5>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Beginning of Proverb"
              value={newProverb.beginning}
              onChange={(e) => setNewProverb({ ...newProverb, beginning: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ending of Proverb"
              value={newProverb.ending}
              onChange={(e) => setNewProverb({ ...newProverb, ending: e.target.value })}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleAddProverb}>
              Add Proverb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
