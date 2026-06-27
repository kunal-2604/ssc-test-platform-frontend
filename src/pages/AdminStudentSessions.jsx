import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminStudentSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchSessions = async () => {
    try {
      const response = await api.get("/auth/admin/student-sessions");
      setSessions(response.data.sessions);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const resetDevice = async (userId) => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this student's device?"
    );

    if (!confirmReset) return;

    try {
      const response = await api.patch(`/auth/admin/reset-device/${userId}`);
      setMessage(response.data.message);
      await fetchSessions();
    } catch (error) {
      setMessage(error.response?.data?.message || "Device reset failed");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading student sessions...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Student Device Sessions</h1>
        <p>View and reset active student device sessions.</p>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Device ID</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.user.name}</td>
                <td>{session.user.email}</td>
                <td className="device-cell">{session.deviceId}</td>
                <td>
                  <span
                    className={`status-badge ${
                      session.isActive ? "status-success" : "status-failed"
                    }`}
                  >
                    {session.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td>{new Date(session.lastActiveAt).toLocaleString()}</td>
                <td>
                  {session.isActive ? (
                    <button
                      className="small-danger-btn"
                      onClick={() => resetDevice(session.user.id)}
                    >
                      Reset Device
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}

            {sessions.length === 0 && (
              <tr>
                <td colSpan="6">No student sessions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudentSessions;
