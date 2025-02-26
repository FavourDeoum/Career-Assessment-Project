// "use client"

// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { motion } from "framer-motion"
// import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa"
// import { supabase } from "../../supabaseClient"
// import "./Login.css"

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError(null)
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: formData.email,
//         password: formData.password,
//       })
//       if (error) throw error
//       if (data && data.user) {
//         console.log("User logged in:", data.user)
//         navigate("/dashboard")
//       } else {
//         throw new Error("Login successful, but user data is missing")
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       setError(error.message)
//     }
//   }

//   const handleSocialLogin = async (provider) => {
//     setError(null)
//     try {
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider,
//       })
//       if (error) throw error
//       if (data) {
//         console.log("Social login initiated:", data)
//       } else {
//         throw new Error("Social login initiated, but no data returned")
//       }
//     } catch (error) {
//       console.error("Social login error:", error)
//       setError(error.message)
//     }
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="login-page">
//       <div className="login-container">
//         <h2 className="login-title">Sign in to your account</h2>
//         {error && <div className="error-message">{error}</div>}
//         <form className="login-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email-address" className="sr-only">
//               Email address
//             </label>
//             <div className="input-group">
//               <FaEnvelope className="input-icon" />
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="form-input"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="password" className="sr-only">
//               Password
//             </label>
//             <div className="input-group">
//               <FaLock className="input-icon" />
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="form-input"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-options">
//             <div className="remember-me">
//               <input id="remember-me" name="remember-me" type="checkbox" className="checkbox" />
//               <label htmlFor="remember-me" className="checkbox-label">
//                 Remember me
//               </label>
//             </div>

//             <div className="forgot-password">
//               {/* Link to the ForgotPassword component */}
//               <Link to="/forgot-password" className="forgot-password-link">
//                 Forgot your password?
//               </Link>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="submit-button"
//           >
//             Sign in
//           </motion.button>
//         </form>

//         <div className="social-login">
//           <div className="social-login-separator">
//             <span className="separator-text">Or continue with</span>
//           </div>

//           <div className="social-buttons">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="social-button google"
//               onClick={() => handleSocialLogin("google")}
//             >
//               <FaGoogle className="social-icon" />
//               <span>Google</span>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="social-button facebook"
//               onClick={() => handleSocialLogin("facebook")}
//             >
//               <FaFacebook className="social-icon" />
//               <span>Facebook</span>
//             </motion.button>
//           </div>
//         </div>

//         <div className="signup-link">
//           <p>
//             Don't have an account?{" "}
//             <Link to="/signup" className="signup-link-text">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Login


// import { SignIn } from '@clerk/clerk-react'

// export default function SignInPage() {
//   return <SignIn />
// }



import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return <SignIn routing="hash" />
}