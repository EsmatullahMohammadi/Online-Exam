/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SUPER_DOMAIN } from "../admin/constant";

const ProtectedRoute = ({ role, requiredRole, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null for loading, true/false for state

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/verify-token`, {
          withCredentials: true, // Ensure cookies are included in the request
          headers: {
            "Content-Type": "application/json",
          },
        });
console.log(response.data)
        if (response.data.status) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false); // Redirect to sign-in if authentication fails
      }
    };

    verifyToken();
  }, []);

  // Show a loading screen while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Redirect to sign-in page if not authenticated
  if (!isAuthenticated || role !== requiredRole) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Render the protected content if authenticated and has the required role
  return children;
};

export default ProtectedRoute;
