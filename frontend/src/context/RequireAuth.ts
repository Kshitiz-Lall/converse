import { useNavigate } from 'react-router-dom';
import React from 'react';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate();
  // Check for token in both localStorage and sessionStorage
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const isAuthenticated = token !== null;

  // Redirect to /signin if the user is not authenticated
  if (!isAuthenticated) {
    navigate('/signin');
    return null; // Return null or a loading spinner, so nothing renders while redirecting
  }

  return children; // Render children if authenticated
};

export default RequireAuth;
