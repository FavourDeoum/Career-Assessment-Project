"use client"

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password", // Replace with your reset password page URL
      })

      if (error) throw error

      setMessage("Password reset email sent. Please check your inbox.")
    } catch (error) {
      console.error("Error sending reset email:", error)
      setError(error.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="input-group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Send Reset Link
          </button>
        </form>

        <div className="signup-link">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="signup-link-text">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword