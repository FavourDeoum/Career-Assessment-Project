import { SignUp } from '@clerk/clerk-react';
// import "./Signup.css";

export default function SignUpPage() {
  return (
    <SignUp
      routing="path" 
      path="/signup"
      fallbackRedirectUrl="http://localhost:5173/cdashboard"
      // afterSignUpUrl="/cdashboard" 
      // afterSignInUrl="/cdashboard"
    />
  );
}