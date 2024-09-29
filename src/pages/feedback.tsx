import React from 'react';
import { useAuth } from './api/auth/useAuth'; // Use the custom hook for auth

const Feedback = () => {
  const loading = useAuth(['admin', 'superadmin']); // Only allow admin and superadmin roles

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking authentication
  }

  return <div>Feedback Page</div>;
};

export default Feedback;
