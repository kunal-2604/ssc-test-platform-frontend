import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        SSC Test Platform
      </Link>

      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === "STUDENT" && (
          <>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/store">Test Series</Link>
            <Link to="/student/my-access">My Access</Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/modules">Modules</Link>
            <Link to="/admin/payments">Payments</Link>
            <Link to="/admin/student-sessions">Sessions</Link>
          </>
        )}

        {user && (
          <>
            <span>{user.name}</span>
            <span className="role-badge">{user.role}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
