"use client"

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setMessage("Password reset successfully. You can now sign in with your new password.")
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      console.error("Error resetting password:", error)
      setError(error.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <div className="input-group">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <div className="input-group">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword