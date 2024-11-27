import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Proverbs = () => {
  const [proverb, setProverb] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/proverbs', { headers: { Authorization: token } })
        .then((res) => setProverb(res.data.combined))
        .catch(() => setProverb('Error loading proverbs.'));
    }
  }, [token]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Georgian Proverbs</h1>
      <p className="text-center">{proverb}</p>
    </div>
  );
};

export default Proverbs;
