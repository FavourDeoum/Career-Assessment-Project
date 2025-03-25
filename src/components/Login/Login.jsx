import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <SignIn
      routing="path" // Use "path" instead of "hash"
      path="/login"
      fallbackRedirectUrl="http://localhost:5173/cdashboard"
      // afterSignInUrl="/cdashboard"
    />
  );
}