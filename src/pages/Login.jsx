import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectUser = (user) => {
    if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      toast.success("Login successful");
      redirectUser(user);
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setGoogleLoading(true);

      if (!credentialResponse.credential) {
        setError("Google credential not received");
        return;
      }

      const user = await googleLogin(credentialResponse.credential);
      toast.success("Google login successful");
      redirectUser(user);
    } catch (error) {
      const message = error.response?.data?.message || "Google login failed";
      setError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to continue your SSC test preparation.">
      {error && <div className="error-box modern-alert">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email address</label>
        <div className="input-with-icon">
          <FiMail />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-label-row">
          <label>Password</label>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="input-with-icon password-input-wrap">
          <FiLock />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
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
          Login
        </Button>
      </form>

      <div className="auth-divider"><span>OR</span></div>

      <div className="google-login-box">
        {googleLoading ? (
          <p className="google-loading-text">Signing in with Google...</p>
        ) : (
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
        )}
      </div>

      <p className="small-text auth-bottom-text">
        New student? <Link to="/register">Create account</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
