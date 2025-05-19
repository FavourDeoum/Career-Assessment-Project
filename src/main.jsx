import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { ClerkProvider } from '@clerk/clerk-react'
import "./index.css"
import { MultisessionAppSupport } from "@clerk/clerk-react/internal"

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <ClerkProvider
  publishableKey={PUBLISHABLE_KEY}
  afterSignInUrl="/cdashboard"
  signInUrl="/sign-in"
  signUpUrl="/sign-up"

>
<MultisessionAppSupport>
        <App />

      </MultisessionAppSupport>
</ClerkProvider>
    </AuthProvider>
  </React.StrictMode>,
)




{/* <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      
    </ClerkProvider> */}


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
