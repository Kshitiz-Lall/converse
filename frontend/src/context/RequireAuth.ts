import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate();

  // Check for token in both localStorage and sessionStorage
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const isAuthenticated = token !== null;

  useEffect(() => {
    // Redirect to /401 if the user is not authenticated
    if (!isAuthenticated) {
      navigate('/401');
    }
  }, [navigate, isAuthenticated]);

  // Return early if not authenticated
  if (!isAuthenticated) {
    return null; // Return null or a loading spinner while redirecting
  }

  return children; // Render children if authenticated
};

export default RequireAuth;
