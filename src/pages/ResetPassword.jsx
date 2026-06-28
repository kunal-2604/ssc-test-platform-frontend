import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await api.post("/auth/reset-password", {
        email: searchParams.get("email"),
        token: searchParams.get("token"),
        newPassword
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p>Enter your new password.</p>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submitHandler}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit">Reset Password</button>
        </form>

        <p className="small-text">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
