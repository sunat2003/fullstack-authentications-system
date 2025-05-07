import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [token, setToken] = useState(null); // null means not yet checked
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setToken(authToken);
    setLoading(false); // done checking
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;

