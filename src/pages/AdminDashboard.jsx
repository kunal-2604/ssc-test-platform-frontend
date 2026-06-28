import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/admin");
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="page-container">
        <div className="error-box">Dashboard data not found</div>
      </div>
    );
  }

  const { summary, recentPayments, recentAttempts } = dashboard;

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Admin Dashboard</h1>
        <p>Overview of students, tests, revenue and recent activity.</p>
      </div>

      <div className="summary-grid dashboard-summary-grid">
        <div className="summary-card">
          <h3>Total Students</h3>
          <strong>{summary.totalStudents}</strong>
          <span>{summary.activeStudents} active</span>
        </div>

        <div className="summary-card">
          <h3>Total Revenue</h3>
          <strong>₹{summary.totalRevenue}</strong>
          <span>{summary.successfulPaymentCount} successful payments</span>
        </div>

        <div className="summary-card">
          <h3>Tests</h3>
          <strong>{summary.totalTests}</strong>
          <span>{summary.publishedTests} published</span>
        </div>

        <div className="summary-card">
          <h3>Attempts</h3>
          <strong>{summary.totalAttempts}</strong>
          <span>{summary.submittedAttempts} submitted</span>
        </div>
      </div>

      <div className="quick-actions-grid">
        <Link to="/admin/tests/create" className="quick-action-card">
          <h3>Create Test</h3>
          <p>Add a new test paper with questions.</p>
        </Link>

        <Link to="/admin/tests" className="quick-action-card">
          <h3>Manage Tests</h3>
          <p>Publish, unpublish and edit tests.</p>
        </Link>

        <Link to="/admin/students" className="quick-action-card">
          <h3>Students</h3>
          <p>Manage students, access and devices.</p>
        </Link>

        <Link to="/admin/reports" className="quick-action-card">
          <h3>Reports</h3>
          <p>View scores and export result data.</p>
        </Link>
      </div>

      <div className="dashboard-two-column">
        <div className="section-card dashboard-section">
          <div className="section-heading-row">
            <h2>Recent Payments</h2>
            <Link to="/admin/payments">View All</Link>
          </div>

          <div className="activity-list">
            {recentPayments.map((payment) => (
              <div className="activity-item" key={payment.id}>
                <div>
                  <strong>{payment.student.name}</strong>
                  <p>
                    {payment.itemName} • {payment.purchaseType}
                  </p>
                </div>

                <div className="activity-right">
                  <strong>₹{payment.amount}</strong>
                  <span
                    className={`status-badge status-${payment.status.toLowerCase()}`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}

            {recentPayments.length === 0 && (
              <p className="empty-text">No recent payments.</p>
            )}
          </div>
        </div>

        <div className="section-card dashboard-section">
          <div className="section-heading-row">
            <h2>Recent Attempts</h2>
            <Link to="/admin/reports">View All</Link>
          </div>

          <div className="activity-list">
            {recentAttempts.map((attempt) => (
              <div className="activity-item" key={attempt.id}>
                <div>
                  <strong>{attempt.student.name}</strong>
                  <p>
                    {attempt.test.title} • {attempt.test.subject}
                  </p>
                </div>

                <div className="activity-right">
                  <strong>
                    {attempt.totalScore} / {attempt.test.totalMarks}
                  </strong>
                  <span
                    className={`status-badge status-${attempt.status.toLowerCase()}`}
                  >
                    {attempt.status}
                  </span>
                </div>
              </div>
            ))}

            {recentAttempts.length === 0 && (
              <p className="empty-text">No recent attempts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
