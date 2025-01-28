import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Proverbs: React.FC = () => {
  const [proverb, setProverb] = useState<string>("");
  const { token } = useAuth();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      const fetchRandomProverb = async () => {
        try {
          console.log('Fetch Proverb Details:', {
            url: `${VITE_API_URL}/proverbs`,
            tokenLength: token.length,
            tokenStart: token.substring(0, 10)
          });
  
          const response = await axios.get(`${VITE_API_URL}/proverbs`, { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          });
  
          console.log('Proverb Response:', response.data);
          setProverb(response.data.combined);
        } catch (err: unknown) {  // Explicitly typing err as 'unknown'
          if (axios.isAxiosError(err)) {
            console.error('Comprehensive Proverb Error:', {
              message: err.message,
              status: err.response?.status,
              data: err.response?.data
            });
          } else {
            console.error('Unknown error:', err);
          }
          setProverb("Error loading proverbs.");
        }
      };
  
      fetchRandomProverb();
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
