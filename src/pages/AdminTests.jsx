import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchTests = async () => {
    try {
      const response = await api.get("/admin/tests");
      setTests(response.data.tests);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  const publishTest = async (testId) => {
    try {
      const response = await api.patch(`/admin/tests/${testId}/publish`);
      setMessage(response.data.message);
      await fetchTests();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to publish test");
    }
  };

  const unpublishTest = async (testId) => {
    try {
      const response = await api.patch(`/admin/tests/${testId}/unpublish`);
      setMessage(response.data.message);
      await fetchTests();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to unpublish test");
    }
  };

  const deleteTest = async (testId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/admin/tests/${testId}`);
      setMessage(response.data.message);
      await fetchTests();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete test");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading tests...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading with-action">
        <div>
          <h1>Admin Tests</h1>
          <p>Create and manage test papers.</p>
        </div>

        <Link to="/admin/tests/create" className="primary-link-btn">
          Create Test
        </Link>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Module</th>
              <th>Subject</th>
              <th>Timer</th>
              <th>Questions</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.title}</td>
                <td>{test.module.name}</td>
                <td>{test.subject}</td>
                <td>{test.durationMinutes} min</td>
                <td>{test.questionCount}</td>
                <td>{test.totalMarks}</td>
                <td>
                  <span className={`status-badge status-${test.status.toLowerCase()}`}>
                    {test.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/tests/${test.id}/questions`} className="small-primary-btn">
                      Questions
                    </Link>

                    <Link to={`/admin/tests/${test.id}/attempts`} className="small-primary-btn">
                      Attempts
                    </Link>

                    {test.status === "PUBLISHED" ? (
                      <button
                        className="small-warning-btn"
                        onClick={() => unpublishTest(test.id)}
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        className="small-success-btn"
                        onClick={() => publishTest(test.id)}
                      >
                        Publish
                      </button>
                    )}

                    <button
                      className="small-danger-btn"
                      onClick={() => deleteTest(test.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {tests.length === 0 && (
              <tr>
                <td colSpan="8">No tests created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTests;
