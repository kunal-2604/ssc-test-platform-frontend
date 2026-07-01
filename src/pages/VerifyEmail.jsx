import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import api from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying email...");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        const response = await api.post("/auth/verify-email", { token, email });
        setMessage(response.data.message);
      } catch (error) {
        setError(error.response?.data?.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <AuthLayout title="Email verification" subtitle="We are confirming your email verification link.">
      <div className={`verification-state ${error ? "verification-error" : "verification-success"}`}>
        <div className="verification-icon">
          {error ? <FiXCircle /> : <FiCheckCircle />}
        </div>
        <h3>{loading ? "Please wait..." : error ? "Verification failed" : "Verification complete"}</h3>
        <p>{error || message}</p>
      </div>

      <Link to="/login" className="auth-link-button">
        <Button fullWidth size="lg">Go to Login</Button>
      </Link>
    </AuthLayout>
  );
};

export default VerifyEmail;
