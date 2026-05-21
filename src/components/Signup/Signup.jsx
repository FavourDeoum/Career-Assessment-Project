import { SignUp } from '@clerk/clerk-react';
// import "./Signup.css";

export default function SignUpPage() {
  return (
    <SignUp
      routing="path" 
      path="/signup"
      fallbackRedirectUrl="/dashboard"
      // afterSignUpUrl="/dashboard" 
      // afterSignInUrl="/dashboard"
    />
  );
}