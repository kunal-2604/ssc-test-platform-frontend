import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await api.post("/auth/forgot-password", {
        email
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive reset link.</p>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submitHandler}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Send Reset Link</button>
        </form>

        <p className="small-text">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
