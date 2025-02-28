import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <SignUp
      routing="hash"
      afterSignUpUrl="/dashboard" // Redirect to the dashboard after signing up
      afterSignInUrl="/dashboard" // Redirect to the dashboard after signing in (optional)
    />
  );
}