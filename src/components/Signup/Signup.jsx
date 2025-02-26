// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
// import { supabase } from "../../supabaseClient";
// import "./Signup.css";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     age: "",
//     location: "",
//     bio: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [step, setStep] = useState(1); // Track the current step
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validatePassword = (password) => {
//     const hasLowercase = /[a-z]/.test(password);
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const isLongEnough = password.length >= 8;

//     return hasLowercase && hasUppercase && hasNumber && isLongEnough;
//   };

//   const validateStep1 = () => {
//     return formData.username.trim() !== "" && formData.email.trim() !== "";
//   };

//   const validateStep2 = () => {
//     return (
//       formData.password.trim() !== "" &&
//       formData.confirmPassword.trim() !== "" &&
//       validatePassword(formData.password)
//     );
//   };

//   const validateStep3 = () => {
//     return formData.age.trim() !== "" && formData.location.trim() !== "";
//   };

//   const validateStep4 = () => {
//     return formData.bio.trim() !== "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     // Check if passwords match
//     if (formData.password !== formData.confirmPassword) {
//       setErrorMessage("Passwords don't match");
//       return;
//     }

//     // Check password requirements
//     if (!validatePassword(formData.password)) {
//       setErrorMessage(
//         "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       // Sign up the user with Supabase
//       const { user, error } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password,
//         options: {
//           data: {
//             username: formData.username,
//             age: formData.age,
//             location: formData.location,
//             bio: formData.bio,
//           },
//         },
//       });

//       if (error) {
//         throw new Error(error.message || "User signup failed, please try again.");
//       }

//       if (!user) {
//         throw new Error("No user object returned from Supabase.");
//       }

//       // Redirect to the dashboard immediately after successful signup
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Signup error:", error);
//       setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const nextStep = () => {
//     if (step === 1 && !validateStep1()) {
//       setErrorMessage("Please fill in all fields.");
//       return;
//     }
//     if (step === 2 && !validateStep2()) {
//       setErrorMessage("Please fill in all fields.");
//       return;
//     }
//     if (step === 3 && !validateStep3()) {
//       setErrorMessage("Please fill in all fields.");
//       return;
//     }
//     if (step === 4 && !validateStep4()) {
//       setErrorMessage("Please fill in all fields.");
//       return;
//     }
//     setStep(step + 1);
//     setErrorMessage("");
//   };

//   const prevStep = () => {
//     setStep(step - 1);
//     setErrorMessage("");
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="signup-page">
//       <div className="signup-container">
//         <h2 className="signup-title">Create your account</h2>
//         {errorMessage && <div className="error-message">{errorMessage}</div>}
//         <form className="signup-form" onSubmit={handleSubmit}>
//           {/* Step 1: Username and Email */}
//           {step === 1 && (
//             <>
//               <div className="form-group">
//                 <label htmlFor="username" className="sr-only">Username</label>
//                 <div className="input-group">
//                   <FaUser className="input-icon" />
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     required
//                     className="form-input"
//                     placeholder="Username"
//                     value={formData.username}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="email-address" className="sr-only">Email address</label>
//                 <div className="input-group">
//                   <FaEnvelope className="input-icon" />
//                   <input
//                     id="email-address"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     className="form-input"
//                     placeholder="Email address"
//                     value={formData.email}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <button type="button" className="next-button" onClick={nextStep} disabled={!validateStep1()}>Next</button>
//             </>
//           )}

//           {/* Step 2: Password and Confirm Password */}
//           {step === 2 && (
//             <>
//               <div className="form-group">
//                 <label htmlFor="password" className="sr-only">Password</label>
//                 <div className="input-group">
//                   <FaLock className="input-icon" />
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     className="form-input"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                   <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 <div className="password-requirements">
//                   <p>Password must:</p>
//                   <ul>
//                     <li className={formData.password.length >= 8 ? "valid" : "invalid"}>
//                       Be at least 8 characters long
//                     </li>
//                     <li className={/[a-z]/.test(formData.password) ? "valid" : "invalid"}>
//                       Include at least one lowercase letter
//                     </li>
//                     <li className={/[A-Z]/.test(formData.password) ? "valid" : "invalid"}>
//                       Include at least one uppercase letter
//                     </li>
//                     <li className={/[0-9]/.test(formData.password) ? "valid" : "invalid"}>
//                       Include at least one number
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
//                 <div className="input-group">
//                   <FaLock className="input-icon" />
//                   <input
//                     id="confirm-password"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     className="form-input"
//                     placeholder="Confirm Password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                   />
//                   <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
//                     {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>
//               <button type="button" className="prev-button" onClick={prevStep}>Previous</button>
//               <button type="button" className="next-button" onClick={nextStep} disabled={!validateStep2()}>Next</button>
//             </>
//           )}

//           {/* Step 3: Age and Location */}
//           {step === 3 && (
//             <>
//               <div className="form-group">
//                 <label htmlFor="age" className="sr-only">Age</label>
//                 <input
//                   id="age"
//                   name="age"
//                   type="number"
//                   required
//                   className="form-input"
//                   placeholder="Age"
//                   min="18"
//                   max="25"
//                   value={formData.age}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="location" className="sr-only">Location</label>
//                 <div className="input-group">
//                   <FaMapMarkerAlt className="input-icon" />
//                   <input
//                     id="location"
//                     name="location"
//                     type="text"
//                     required
//                     className="form-input"
//                     placeholder="Location"
//                     value={formData.location}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <button type="button" className="prev-button" onClick={prevStep}>Previous</button>
//               <button type="button" className="next-button" onClick={nextStep} disabled={!validateStep3()}>Next</button>
//             </>
//           )}

//           {/* Step 4: Bio and Submit Button */}
//           {step === 4 && (
//             <>
//               <div className="form-group">
//                 <label htmlFor="bio" className="sr-only">Bio</label>
//                 <textarea
//                   id="bio"
//                   name="bio"
//                   rows={3}
//                   className="form-input"
//                   placeholder="Tell us about yourself"
//                   value={formData.bio}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="submit"
//                 className="submit-button"
//                 disabled={loading || !validateStep4()}
//               >
//                 {loading ? "Signing up..." : "Sign up"}
//               </motion.button>
//               <button type="button" className="prev-button" onClick={prevStep}>Previous</button>
//             </>
//           )}
//         </form>

//         <div className="login-link">
//           <p>
//             Already have an account?{" "}
//             <Link to="/login" className="login-link-text">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Signup;



// import { SignUp } from '@clerk/clerk-react'

// export default function SignUpPage() {
//   return <SignUp />
// }



import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return <SignUp routing="hash" />
}