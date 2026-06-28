import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const AdminTestAttempts = () => {
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchAttempts = async () => {
    try {
      const response = await api.get(`/admin/tests/${testId}/attempts`);
      setTest(response.data.test);
      setAttempts(response.data.attempts);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load attempts");
    } finally {
      setLoading(false);
    }
  };

  const allowReattempt = async (userId) => {
    const confirmReset = window.confirm(
      "Are you sure? This will delete the student's submitted attempt and answers. The student can give the test again."
    );

    if (!confirmReset) return;

    try {
      const response = await api.delete(
        `/admin/tests/${testId}/attempts/${userId}/allow-reattempt`
      );

      setMessage(response.data.message);
      await fetchAttempts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to allow reattempt");
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [testId]);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading attempts...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading with-action">
        <div>
          <h1>Test Attempts</h1>
          <p>{test?.title}</p>
        </div>

        <Link to="/admin/tests" className="primary-link-btn">
          Back to Tests
        </Link>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Score</th>
              <th>Started</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id}>
                <td>{attempt.user.name}</td>
                <td>{attempt.user.email}</td>
                <td>{attempt.user.phone || "-"}</td>
                <td>
                  <span className={`status-badge status-${attempt.status.toLowerCase()}`}>
                    {attempt.status}
                  </span>
                </td>
                <td>{attempt.totalScore}</td>
                <td>{new Date(attempt.startedAt).toLocaleString()}</td>
                <td>
                  {attempt.submittedAt
                    ? new Date(attempt.submittedAt).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="small-warning-btn"
                    onClick={() => allowReattempt(attempt.user.id)}
                  >
                    Allow Reattempt
                  </button>
                </td>
              </tr>
            ))}

            {attempts.length === 0 && (
              <tr>
                <td colSpan="8">No attempts found for this test.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTestAttempts;
