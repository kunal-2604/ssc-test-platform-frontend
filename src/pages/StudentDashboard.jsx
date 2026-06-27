import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>Student Dashboard</h1>
        <p>Welcome, {user?.name}</p>

        <div className="info-grid">
          <div>
            <strong>Email</strong>
            <span>{user?.email}</span>
          </div>

          <div>
            <strong>Role</strong>
            <span>{user?.role}</span>
          </div>
        </div>

        <div className="action-row">
          <Link to="/student/store" className="primary-link-btn">
            View Test Series
          </Link>
        </div>

        <div className="next-box">
          <h3>Available Test Series</h3>
          <p>
            Science, Social Science, Maths and Full Package are now available.
            Payment integration will be added in Phase 4.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
