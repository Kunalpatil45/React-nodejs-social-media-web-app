import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Wait until user is restored from localStorage
  if (loading) return <div>Loading...</div>;

  // If still no user → redirect
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
