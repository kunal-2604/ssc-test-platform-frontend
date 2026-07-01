import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import api from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);

      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
      toast.success("Reset link request submitted");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset email";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email and we will send a secure reset link.">
      {message && <div className="success-box modern-alert">{message}</div>}
      {error && <div className="error-box modern-alert">{error}</div>}

      <form className="auth-form" onSubmit={submitHandler}>
        <label>Email address</label>
        <div className="input-with-icon">
          <FiMail />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Send Reset Link
        </Button>
      </form>

      <p className="small-text auth-bottom-text">
        <Link to="/login"><FiArrowLeft /> Back to Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
