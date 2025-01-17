import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Proverbs: React.FC = () => {
  const [proverb, setProverb] = useState("");
  const { token } = useAuth();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      axios
        .get(`${VITE_API_URL}/api/proverbs/random`, { headers: { Authorization: token } })
        .then((res) => setProverb(res.data.combined))
        .catch((err) => {
          console.error('Error details:', err);
          setProverb("Error loading proverbs.");
        });
    }
  }, [token, VITE_API_URL]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Random Georgian Proverb</h1>
      <p className="text-center fs-4">{proverb}</p>
    </div>
  );
};

export default Proverbs;
