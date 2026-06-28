import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        const response = await api.post("/auth/verify-email", {
          token,
          email
        });

        setMessage(response.data.message);
      } catch (error) {
        setError(error.response?.data?.message || "Email verification failed");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Email Verification</h2>

        {error ? (
          <div className="error-box">{error}</div>
        ) : (
          <div className="success-box">{message}</div>
        )}

        <Link to="/login" className="primary-link-btn">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
