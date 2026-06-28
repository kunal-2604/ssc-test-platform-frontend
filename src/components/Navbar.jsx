import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const dashboardPath =
    user.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <nav className="navbar">
      <Link to={dashboardPath} className="logo">
        <img src="/logo.png" alt="SSC Test Platform" />
        <span>SSC Test Platform</span>
      </Link>

      <div className="nav-links">
        {user.role === "STUDENT" && (
          <>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/tests">My Tests</Link>
            <Link to="/student/store">Buy Series</Link>
            <Link to="/student/my-access">My Access</Link>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/tests">Tests</Link>
            <Link to="/admin/students">Students</Link>
            <Link to="/admin/reports">Reports</Link>
            <Link to="/admin/payments">Payments</Link>
            <Link to="/admin/modules">Modules</Link>
          </>
        )}

        <span className="user-name">{user.name}</span>
        <span className="role-badge">{user.role}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
