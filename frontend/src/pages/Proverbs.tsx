import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Proverbs: React.FC = () => {
  const [proverb, setProverb] = useState<string>("");
  const { token } = useAuth();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchRandomProverb = async () => {
    if (token) {
      try {
        console.log("Fetching Random Proverb...");
        const response = await axios.get(`${VITE_API_URL}/proverbs/random`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response:", response.data);
        setProverb(response.data.combined);
      } catch (error) {
        console.error("Error fetching proverb:", error);
        setProverb("Error loading proverbs.");
      }
    }
  };

  useEffect(() => {
    fetchRandomProverb();
  }, [token]);

  return (
    <div className="container text-center mt-5">
      <h1>Random Georgian Proverb</h1>
      <p className="fs-4">{proverb}</p>
      <button className="btn btn-primary mt-3" onClick={fetchRandomProverb}>
        Regenerate
      </button>
    </div>
  );
};

export default Proverbs;
