import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <SignUp
      routing="path" // Change from "hash" to "path"
      path="/signup"
      afterSignUpUrl="/cdashboard" 
      afterSignInUrl="/cdashboard"
    />
  );
}