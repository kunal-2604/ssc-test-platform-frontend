import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const TestInstructions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const fetchInstructions = async () => {
    try {
      const response = await api.get(`/student/tests/${testId}/instructions`);
      setTest(response.data.test);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load instructions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructions();
  }, [testId]);

  const startTest = async () => {
    try {
      setStarting(true);
      setError("");

      const response = await api.post(`/student/tests/${testId}/start`);

      navigate(`/student/attempts/${response.data.attempt.id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to start test");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading instructions...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-box">{error}</div>
        <Link to="/student/tests" className="primary-link-btn">
          Back to Tests
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <h1>{test.title}</h1>
        <p>{test.description}</p>

        <div className="info-grid">
          <div>
            <strong>Module</strong>
            <span>{test.module.name}</span>
          </div>

          <div>
            <strong>Subject</strong>
            <span>{test.subject}</span>
          </div>

          <div>
            <strong>Duration</strong>
            <span>{test.durationMinutes} minutes</span>
          </div>

          <div>
            <strong>Total Marks</strong>
            <span>{test.totalMarks}</span>
          </div>

          <div>
            <strong>Questions</strong>
            <span>{test.questionCount}</span>
          </div>
        </div>

        <div className="next-box">
          <h3>Instructions</h3>
          <p>{test.instructions || "Attempt all questions carefully."}</p>
          <ul>
            <li>Do not refresh the page during the test.</li>
            <li>The test timer will start immediately after clicking Start Test.</li>
            <li>Submit before the timer ends.</li>
            <li>Do not open the test in multiple tabs.</li>
          </ul>
        </div>

        {test.attempt?.status === "IN_PROGRESS" ? (
          <Link
            to={`/student/attempts/${test.attempt.id}`}
            className="primary-link-btn"
          >
            Resume Existing Attempt
          </Link>
        ) : test.attempt ? (
          <button className="access-btn" disabled>
            Already Attempted: {test.attempt.status}
          </button>
        ) : (
          <button className="start-test-btn" onClick={startTest} disabled={starting}>
            {starting ? "Starting..." : "Start Test"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestInstructions;
