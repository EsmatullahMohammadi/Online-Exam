/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { SUPER_DOMAIN } from "../admin/constant";

const ProtectedRoute = ({ requiredRole, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const adminRole = sessionStorage.getItem("arole");
  const lecturerRole = sessionStorage.getItem("lrole");
  const candidateRole = sessionStorage.getItem("crole");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        let isValid = false; 
        if (adminRole === "Admin") {
          const response = await axios.get(`${SUPER_DOMAIN}/verify-token`, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });
          if (response.data.status) {
            isValid = true;
          }
        }
        if (lecturerRole === "Lecturer") {
          const response = await axios.get(`${SUPER_DOMAIN}/verify-lcturer-token`, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });
          if (response.data.status) {
            isValid = true;
          }
        }
        if (candidateRole === "Candidate") {
          const response = await axios.get(`${SUPER_DOMAIN}/verify-candidate-token`, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });
          if (response.data.status) {
            isValid = true;
          }
        }
        setIsAuthenticated(isValid);
      } catch (err) {
        console.error("Error during token verification:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    verifyToken();
  }, [adminRole, lecturerRole, candidateRole]);
  

  // Show a loading screen while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to sign-in page if not authenticated or role does not match
  if (!isAuthenticated || (adminRole !== requiredRole && lecturerRole !== requiredRole && candidateRole !== requiredRole)) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Render the protected content if authenticated and has the required role
  return children;
};

export default ProtectedRoute;
