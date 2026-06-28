import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const StudentTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    try {
      const response = await api.get("/student/tests");
      setTests(response.data.tests);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
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
      <div className="page-heading">
        <h1>My Tests</h1>
        <p>These tests are available based on your purchased modules.</p>
      </div>

      <div className="module-grid">
        {tests.map((test) => (
          <div className="module-card" key={test.id}>
            <div>
              <h3>{test.title}</h3>
              <p>{test.description || "No description added."}</p>

              <div className="subject-list">
                <span>{test.module.name}</span>
                <span>{test.subject}</span>
              </div>
            </div>

            <div className="module-footer">
              <div>
                <strong>{test.durationMinutes}</strong>
                <span>Minutes</span>
              </div>

              <div>
                <strong>{test.totalMarks}</strong>
                <span>Marks</span>
              </div>
            </div>

            {test.attempt?.status === "IN_PROGRESS" ? (
              <Link
                to={`/student/attempts/${test.attempt.id}`}
                className="primary-link-btn full-width-btn"
              >
                Resume Test
              </Link>
            ) : test.attempt?.status === "AUTO_CHECKED" ||
              test.attempt?.status === "EVALUATED" ? (
              <Link
                to={`/student/attempts/${test.attempt.id}/result`}
                className="primary-link-btn full-width-btn"
              >
                View Result
              </Link>
            ) : test.attempt ? (
              <button className="access-btn" disabled>
                {test.attempt.status}
              </button>
            ) : (
              <Link
                to={`/student/tests/${test.id}/instructions`}
                className="primary-link-btn full-width-btn"
              >
                View Instructions
              </Link>
            )}
          </div>
        ))}

        {tests.length === 0 && (
          <div className="dashboard-card">
            <h2>No tests available</h2>
            <p>
              Buy a test series first, or wait until admin publishes tests for your module.
            </p>
            <Link to="/student/store" className="primary-link-btn">
              Buy Test Series
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTests;
