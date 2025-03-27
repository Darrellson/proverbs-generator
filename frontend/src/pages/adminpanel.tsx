import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AdminPanel: React.FC = () => {
  const { token, isAdmin, setAdminState } = useAuth();
  const navigate = useNavigate();
  const [proverbs, setProverbs] = useState<{ id: number; beginning: string; ending: string }[]>([]);
  const [editedProverbId, setEditedProverbId] = useState<number | null>(null);
  const [editedProverb, setEditedProverb] = useState<{ beginning: string; ending: string }>({ beginning: "", ending: "" });
  const [newProverb, setNewProverb] = useState<{ beginning: string; ending: string }>({ beginning: "", ending: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchProverbs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/proverbs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProverbs(res.data);
      setError(null);
    } catch (error) {
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

  useEffect(() => {
    if (!token || !isAdmin) {
      alert("Access Denied: Admins Only");
      navigate("/login");
      return;
    }
    fetchProverbs();
  }, [token, isAdmin]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this proverb?")) return;

    setDeleting(id);
    try {
      await axios.delete(`${VITE_API_URL}/proverbs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProverbs(proverbs.filter((proverb) => proverb.id !== id));
    } catch (error) {
      console.error("Error deleting proverb:", error);
      alert("Failed to delete proverb. Try again.");
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
      const res = await axios.post(`${VITE_API_URL}/proverbs`, newProverb, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProverbs([...proverbs, res.data]);
      setNewProverb({ beginning: "", ending: "" });
    } catch (error) {
      console.error("Error adding proverb:", error);
      alert("Failed to add proverb. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleEditProverb = (id: number) => {
    const proverb = proverbs.find((p) => p.id === id);
    if (proverb) {
      setEditedProverb({ beginning: proverb.beginning, ending: proverb.ending });
      setEditedProverbId(id);
    }
  };

  const handleUpdateProverb = async () => {
    if (!editedProverb.beginning || !editedProverb.ending || !token) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const res = await axios.put(`${VITE_API_URL}/proverbs/${editedProverbId}`, editedProverb, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProverbs(proverbs.map((p) => (p.id === editedProverbId ? res.data : p)));
      setEditedProverbId(null);
      setEditedProverb({ beginning: "", ending: "" });
    } catch (error) {
      console.error("Error updating proverb:", error);
      alert("Failed to update proverb. Try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditedProverbId(null);
    setEditedProverb({ beginning: "", ending: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/json") {
        setFileError("Please upload a valid JSON file.");
        setFile(null);
      } else {
        setFileError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setFileError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${VITE_API_URL}/proverbs/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
      fetchProverbs(); // Fetch updated proverbs after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel</h2>

      {loading && <p className="text-center">Loading proverbs...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Proverbs List */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <h4 className="text-center">Proverbs List</h4>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <ul className="list-group">
              {proverbs.map((proverb) => (
                <li key={proverb.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {editedProverbId === proverb.id ? (
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        value={editedProverb.beginning}
                        onChange={(e) => setEditedProverb({ ...editedProverb, beginning: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={editedProverb.ending}
                        onChange={(e) => setEditedProverb({ ...editedProverb, ending: e.target.value })}
                      />
                    </div>
                  ) : (
                    <span>
                      <strong>{proverb.beginning}</strong> - {proverb.ending}
                    </span>
                  )}
                  <div className="btn-group">
                    {editedProverbId === proverb.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={handleUpdateProverb}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-warning btn-sm" onClick={() => handleEditProverb(proverb.id)}>Edit</button>
                        <button
                          onClick={() => handleDelete(proverb.id)}
                          className="btn btn-danger btn-sm"
                          disabled={deleting === proverb.id}
                        >
                          {deleting === proverb.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title text-center">Upload Proverbs JSON File</h5>
          <input type="file" accept=".json" onChange={handleFileChange} className="form-control mb-3" />
          {fileError && <p className="text-danger">{fileError}</p>}
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary" onClick={handleFileUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>
      </div>

      {/* Add New Proverb Section */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title text-center">Add New Proverb</h5>
          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Beginning of Proverb"
              value={newProverb.beginning}
              onChange={(e) => setNewProverb({ ...newProverb, beginning: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Ending of Proverb"
              value={newProverb.ending}
              onChange={(e) => setNewProverb({ ...newProverb, ending: e.target.value })}
            />
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary" onClick={handleAddProverb} disabled={adding}>
              {adding ? "Adding..." : "Add Proverb"}
            </button>
            <button className="btn btn-secondary" onClick={() => setNewProverb({ beginning: "", ending: "" })}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
