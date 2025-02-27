import React from 'react';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    // Redirect to the sign-in page if the user is not signed in
    return <RedirectToSignIn fallbackRedirectUrl="/dashboard" />;
  }

  // Render the children if the user is signed in
  return children;
};

export default ProtectedRoute;