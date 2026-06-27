import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>Admin Dashboard</h1>
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
          <Link to="/admin/modules" className="primary-link-btn">
            View Modules
          </Link>
        </div>

        <div className="next-box">
          <h3>Admin Progress</h3>
          <p>
            Modules and pricing are now configured. Later phases will add
            payments, test creation and result management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
