import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    // Redirect to home page if the user is not an admin
    return <Navigate to="/" replace />;
  }

  // Render the protected component if the user is an admin
  return children;
};

export default ProtectedRoute;