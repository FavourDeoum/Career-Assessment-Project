import { SignIn } from '@clerk/clerk-react';
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <SignIn
        routing="path"
        path="/login"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}