
// import { SignIn } from '@clerk/clerk-react'

// export default function SignInPage() {
//   return <SignIn />
// }



import { SignIn } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <SignIn
      routing="hash"
      afterSignUpUrl="/cdashboard" // Redirect to the dashboard after signing up
      afterSignInUrl="/cdashboard" // Redirect to the dashboard after signing in (optional)
    />
  );
}