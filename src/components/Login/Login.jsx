
// import { SignIn } from '@clerk/clerk-react'

// export default function SignInPage() {
//   return <SignIn />
// }



import { SignIn } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <SignIn
      routing="hash"
      afterSignUpUrl="/dashboard" // Redirect to the dashboard after signing up
      afterSignInUrl="/dashboard" // Redirect to the dashboard after signing in (optional)
    />
  );
}