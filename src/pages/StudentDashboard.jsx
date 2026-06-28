import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/student");
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
        <h2>Loading student dashboard...</h2>
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

  const { summary, modules, recentAttempts } = dashboard;

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Student Dashboard</h1>
        <p>Track your test series access, attempts and performance.</p>
      </div>

      <div className="summary-grid dashboard-summary-grid">
        <div className="summary-card">
          <h3>My Modules</h3>
          <strong>{summary.activeModuleCount}</strong>
          <span>Active access</span>
        </div>

        <div className="summary-card">
          <h3>Available Tests</h3>
          <strong>{summary.availableTests}</strong>
          <span>Published tests</span>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <strong>{summary.completedTests}</strong>
          <span>{summary.inProgressTests} in progress</span>
        </div>

        <div className="summary-card">
          <h3>Average</h3>
          <strong>{summary.averagePercentage}%</strong>
          <span>Overall score</span>
        </div>
      </div>

      <div className="quick-actions-grid">
        <Link to="/student/tests" className="quick-action-card">
          <h3>My Tests</h3>
          <p>Start or resume your available tests.</p>
        </Link>

        <Link to="/student/store" className="quick-action-card">
          <h3>Buy Test Series</h3>
          <p>Purchase subject-wise or full package access.</p>
        </Link>

        <Link to="/student/my-access" className="quick-action-card">
          <h3>My Access</h3>
          <p>View active modules and payment history.</p>
        </Link>
      </div>

      <div className="dashboard-two-column">
        <div className="section-card dashboard-section">
          <div className="section-heading-row">
            <h2>Active Modules</h2>
            <Link to="/student/my-access">View Access</Link>
          </div>

          <div className="activity-list">
            {modules.map((module) => (
              <div className="activity-item" key={module.id}>
                <div>
                  <strong>{module.name}</strong>
                  <p>{module.subjects.join(", ")}</p>
                </div>

                <span className="status-badge status-success">
                  {module.purchaseType}
                </span>
              </div>
            ))}

            {modules.length === 0 && (
              <div className="empty-state-small">
                <p>No active modules yet.</p>
                <Link to="/student/store" className="small-primary-btn">
                  Buy Now
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="section-card dashboard-section">
          <div className="section-heading-row">
            <h2>Recent Attempts</h2>
            <Link to="/student/tests">View Tests</Link>
          </div>

          <div className="activity-list">
            {recentAttempts.map((attempt) => (
              <div className="activity-item" key={attempt.id}>
                <div>
                  <strong>{attempt.test.title}</strong>
                  <p>
                    {attempt.test.module} • {attempt.test.subject}
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
              <p className="empty-text">No test attempts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
