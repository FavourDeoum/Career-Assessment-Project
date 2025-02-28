import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <SignUp
      routing="hash"
      afterSignUpUrl="/cdashboard" // Redirect to the dashboard after signing up
      afterSignInUrl="/cdashboard" // Redirect to the dashboard after signing in (optional)
    />
  );
}