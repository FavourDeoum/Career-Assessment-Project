import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const SSOCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clerk = useClerk();

  useEffect(() => {
    const handleSSOCallback = async () => {
      try {
        // Extract parameters from the URL
        const signUpFallbackRedirectUrl = searchParams.get('sign_up_fallback_redirect_url');
        const afterSignInUrl = searchParams.get('after_sign_in_url');
        const afterSignUpUrl = searchParams.get('after_sign_up_url');

        // Handle the SSO callback
        await clerk.handleSSOCallback();

        // Redirect based on the parameters after successful sign-in or sign-up
        if (afterSignInUrl) {
          navigate(afterSignInUrl);
        } else if (afterSignUpUrl) {
          navigate(afterSignUpUrl);
        } else {
          navigate('/cdashboard'); // Fallback to home if no redirect URL is provided
        }
      } catch (error) {
        console.error('SSO Callback Error:', error);
        // Optionally redirect to an error page or show a message
        navigate('/login'); // Redirect to login on error
      }
    };

    handleSSOCallback();
  }, [clerk, navigate, searchParams]);

  return (
    <div>
      <h1>Processing SSO Callback...</h1>
      {/* Optionally, add a loading spinner or message here */}
    </div>
  );
};

export default SSOCallback;