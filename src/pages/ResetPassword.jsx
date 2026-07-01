import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import api from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        email: searchParams.get("email"),
        token: searchParams.get("token"),
        newPassword
      });

      setMessage(response.data.message);
      toast.success("Password reset successful");
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Create a new password for your account.">
      {message && <div className="success-box modern-alert">{message}</div>}
      {error && <div className="error-box modern-alert">{error}</div>}

      <form className="auth-form" onSubmit={submitHandler}>
        <label>New password</label>
        <div className="input-with-icon password-input-wrap">
          <FiLock />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Reset Password
        </Button>
      </form>

      <p className="small-text auth-bottom-text">
        <Link to="/login"><FiArrowLeft /> Back to Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
