import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AdminPanel: React.FC = () => {
  const { token, isAdmin, setAdminState } = useAuth();
  const navigate = useNavigate();
  const [proverbs, setProverbs] = useState<{ id: number; beginning: string; ending: string }[]>([]);
  const [newProverb, setNewProverb] = useState({ beginning: "", ending: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !isAdmin) {
      alert("Access Denied: Admins Only");
      navigate("/login");
      return;
    }

    const fetchProverbs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${VITE_API_URL}/proverbs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProverbs(res.data);
        setError(null);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            await setAdminState();
          } else {
            setError("Error fetching proverbs.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProverbs();
  }, [token, isAdmin, navigate]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this proverb?");
    if (!confirmDelete) return;

    setDeleting(id);
    try {
      await axios.delete(`${VITE_API_URL}/proverbs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProverbs(proverbs.filter((proverb) => proverb.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting proverb:", error);
        alert("Failed to delete proverb. Try again.");
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleAddProverb = async () => {
    if (!newProverb.beginning || !newProverb.ending || !token) {
      alert("Please fill in both fields.");
      return;
    }

    setAdding(true);
    try {
      const res = await axios.post(
        `${VITE_API_URL}/proverbs`,
        { beginning: newProverb.beginning, ending: newProverb.ending },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProverbs([...proverbs, res.data]);
      setNewProverb({ beginning: "", ending: "" });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding proverb:", error);
        alert("Failed to add proverb. Try again.");
      }
    } finally {
      setAdding(false);
    }
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
              <li key={proverb.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>{proverb.beginning}</strong> - {proverb.ending}
                </span>
                <button
                  onClick={() => handleDelete(proverb.id)}
                  className="btn btn-danger btn-sm"
                  disabled={deleting === proverb.id}
                >
                  {deleting === proverb.id ? "Deleting..." : "Delete"}
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
          <button className="btn btn-primary" onClick={handleAddProverb} disabled={adding}>
            {adding ? "Adding..." : "Add Proverb"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
