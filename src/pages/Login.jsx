import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectUser = (user) => {
    if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      redirectUser(user);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
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
      redirectUser(user);
    } catch (error) {
      setError(error.response?.data?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Login to access your tests</p>

        {error && <div className="error-box">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="small-text">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="google-login-box">
          {googleLoading ? (
            <p>Signing in with Google...</p>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          )}
        </div>

        <p className="small-text">
          New student? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
