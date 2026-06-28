import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminReports = () => {
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const [summaryResponse, resultsResponse] = await Promise.all([
        api.get("/admin/reports/summary"),
        api.get("/admin/reports/results")
      ]);

      setSummary(summaryResponse.data.summary);
      setResults(resultsResponse.data.results);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      const response = await api.get("/admin/reports/results/export", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "student-results.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("CSV export failed");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading reports...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading with-action">
        <div>
          <h1>Reports & Results</h1>
          <p>View student performance, scores and test attempts.</p>
        </div>

        <button className="small-success-btn" onClick={downloadCsv}>
          Export CSV
        </button>
      </div>

      {summary && (
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Total Attempts</h3>
            <strong>{summary.totalAttempts}</strong>
          </div>

          <div className="summary-card">
            <h3>Submitted</h3>
            <strong>{summary.submittedAttempts}</strong>
          </div>

          <div className="summary-card">
            <h3>In Progress</h3>
            <strong>{summary.inProgressAttempts}</strong>
          </div>

          <div className="summary-card">
            <h3>Total Students</h3>
            <strong>{summary.totalStudents}</strong>
          </div>

          <div className="summary-card">
            <h3>Average Score</h3>
            <strong>{Number(summary.averageScore).toFixed(2)}</strong>
          </div>

          <div className="summary-card">
            <h3>Highest Score</h3>
            <strong>{summary.highestScore}</strong>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Test</th>
              <th>Module</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.student.name}</td>
                <td>{result.student.email}</td>
                <td>{result.test.title}</td>
                <td>{result.test.module.name}</td>
                <td>{result.test.subject}</td>
                <td>
                  {result.totalScore} / {result.test.totalMarks}
                </td>
                <td>
                  <span className={`status-badge status-${result.status.toLowerCase()}`}>
                    {result.status}
                  </span>
                </td>
                <td>
                  {result.submittedAt
                    ? new Date(result.submittedAt).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <Link
                    to={`/admin/reports/results/${result.id}`}
                    className="small-primary-btn"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan="9">No results found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
