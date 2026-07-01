import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBarChart2,
  FiBookOpen,
  FiCreditCard,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiPieChart,
  FiUser,
  FiUsers,
  FiX
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dashboardPath = user?.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  const navLinks = useMemo(() => {
    if (user?.role === "ADMIN") {
      return [
        { to: "/admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
        { to: "/admin/tests", label: "Tests", icon: <FiBookOpen /> },
        { to: "/admin/students", label: "Students", icon: <FiUsers /> },
        { to: "/admin/reports", label: "Reports", icon: <FiPieChart /> },
        { to: "/admin/payments", label: "Payments", icon: <FiCreditCard /> },
        { to: "/admin/modules", label: "Modules", icon: <FiPackage /> }
      ];
    }

    return [
      { to: "/student/dashboard", label: "Dashboard", icon: <FiGrid /> },
      { to: "/student/tests", label: "My Tests", icon: <FiBookOpen /> },
      { to: "/student/store", label: "Buy Series", icon: <FiCreditCard /> },
      { to: "/student/my-access", label: "My Access", icon: <FiPackage /> }
    ];
  }, [user?.role]);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const renderLinks = () => (
    <>
      {navLinks.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <span className="nav-link-icon">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <motion.nav
      className="navbar app-navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link to={dashboardPath} className="logo app-logo" onClick={() => setMenuOpen(false)}>
        <img src="/logo.png" alt="SSC Test Platform" />
        <span>SSC Test Platform</span>
      </Link>

      <div className="nav-links desktop-nav">{renderLinks()}</div>

      <div className="nav-user-area">
        <button
          className="nav-profile-btn"
          type="button"
          onClick={() => setProfileOpen((prev) => !prev)}
          aria-label="Open profile menu"
        >
          <span className="nav-avatar">{user.name?.charAt(0)?.toUpperCase() || <FiUser />}</span>
          <span className="nav-user-name">{user.name}</span>
          <span className="role-badge">{user.role}</span>
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              className="profile-dropdown"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="profile-dropdown-head">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <button className="profile-dropdown-action" type="button" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="mobile-menu-btn"
          type="button"
          aria-label="Toggle mobile menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderLinks()}
            <button className="logout-btn mobile-logout" type="button" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
