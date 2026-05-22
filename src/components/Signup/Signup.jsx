import { SignUp } from '@clerk/clerk-react';
import "./Signup.css";

export default function SignUpPage() {
  return (
    <div className="signup-page">
      <SignUp
        routing="path"
        path="/signup"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}