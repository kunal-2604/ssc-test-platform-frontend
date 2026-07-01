import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiAward, FiBarChart2, FiCheckCircle, FiShield } from "react-icons/fi";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <main className="auth-shell">
      <motion.section
        className="auth-visual-panel"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link to="/" className="auth-brand">
          <img src="/logo.png" alt="SSC Test Platform" />
          <span>SSC Test Platform</span>
        </Link>

        <div className="auth-hero-copy">
          <span className="auth-pill">SSC Maharashtra Board</span>
          <h1>Smart online tests for confident board exam preparation.</h1>
          <p>
            Practice subject-wise tests, track performance and improve exam readiness
            with a clean digital test experience.
          </p>
        </div>

        <div className="auth-feature-grid">
          <div>
            <FiAward />
            <span>Board-focused tests</span>
          </div>
          <div>
            <FiBarChart2 />
            <span>Instant results</span>
          </div>
          <div>
            <FiShield />
            <span>Secure access</span>
          </div>
          <div>
            <FiCheckCircle />
            <span>Progress tracking</span>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="auth-form-panel"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <div className="auth-card-modern">
          <div className="auth-card-heading">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </div>
      </motion.section>
    </main>
  );
};

export default AuthLayout;
