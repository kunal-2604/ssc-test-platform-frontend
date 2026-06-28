import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const AdminStudentDetail = () => {
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modules, setModules] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/admin/students/${studentId}`);
      setStudent(response.data.student);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const confirmAction = window.confirm(
      "Are you sure you want to change this student's active status?"
    );

    if (!confirmAction) return;

    try {
      const response = await api.patch(
        `/admin/students/${studentId}/toggle-status`
      );
      setMessage(response.data.message);
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update status");
    }
  };

  const resetDevice = async () => {
    const confirmAction = window.confirm(
      "Reset this student's device? They will need to login again."
    );

    if (!confirmAction) return;

    try {
      const response = await api.patch(
        `/admin/students/${studentId}/reset-device`
      );
      setMessage(response.data.message);
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset device");
    }
  };

  const allowReattempt = async (testId) => {
    const confirmAction = window.confirm(
      "This will delete the student's old attempt and answers. Allow reattempt?"
    );

    if (!confirmAction) return;

    try {
      const response = await api.delete(
        `/admin/students/${studentId}/tests/${testId}/allow-reattempt`
      );
      setMessage(response.data.message);
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to allow reattempt");
    }
  };

  const fetchAccessOptions = async () => {
    try {
      const [modulesResponse, packagesResponse] = await Promise.all([
        api.get("/modules"),
        api.get("/modules/packages")
      ]);

      setModules(modulesResponse.data.modules || []);
      setPackages(packagesResponse.data.packages || []);
    } catch (error) {
      console.log("Failed to load access options");
    }
  };

  const grantModuleAccess = async () => {
    if (!selectedModuleId) {
      setMessage("Please select a module");
      return;
    }

    const confirmAction = window.confirm(
      "Grant this module access manually?"
    );

    if (!confirmAction) return;

    try {
      const response = await api.post(
        `/admin/students/${studentId}/grant-module-access`,
        {
          moduleId: selectedModuleId
        }
      );

      setMessage(response.data.message);
      setSelectedModuleId("");
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to grant module access");
    }
  };

  const grantPackageAccess = async () => {
    if (!selectedPackageId) {
      setMessage("Please select a package");
      return;
    }

    const confirmAction = window.confirm(
      "Grant this full package access manually?"
    );

    if (!confirmAction) return;

    try {
      const response = await api.post(
        `/admin/students/${studentId}/grant-package-access`,
        {
          packageId: selectedPackageId
        }
      );

      setMessage(response.data.message);
      setSelectedPackageId("");
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to grant package access");
    }
  };

  const revokeAccess = async (moduleId) => {
    const confirmAction = window.confirm(
      "Revoke this module access?"
    );

    if (!confirmAction) return;

    try {
      const response = await api.patch(
        `/admin/students/${studentId}/modules/${moduleId}/revoke-access`
      );

      setMessage(response.data.message);
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to revoke access");
    }
  };

  const restoreAccess = async (moduleId) => {
    const confirmAction = window.confirm(
      "Restore this module access?"
    );

    if (!confirmAction) return;

    try {
      const response = await api.patch(
        `/admin/students/${studentId}/modules/${moduleId}/restore-access`
      );

      setMessage(response.data.message);
      await fetchStudent();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to restore access");
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchAccessOptions();
  }, [studentId]);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading student...</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="page-container">
        <div className="error-box">Student not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading with-action">
        <div>
          <h1>{student.name}</h1>
          <p>{student.email}</p>
        </div>

        <Link to="/admin/students" className="primary-link-btn">
          Back to Students
        </Link>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="dashboard-card">
        <div className="info-grid">
          <div>
            <strong>Name</strong>
            <span>{student.name}</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>{student.email}</span>
          </div>

          <div>
            <strong>Phone</strong>
            <span>{student.phone || "-"}</span>
          </div>

          <div>
            <strong>Status</strong>
            <span>{student.isActive ? "ACTIVE" : "INACTIVE"}</span>
          </div>

          <div>
            <strong>Joined</strong>
            <span>{new Date(student.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="small-warning-btn" onClick={toggleStatus}>
            {student.isActive ? "Deactivate Student" : "Activate Student"}
          </button>

          <button className="small-danger-btn" onClick={resetDevice}>
            Reset Device
          </button>
        </div>
      </div>

      <div className="section-card">
        <h2>Manual Access Management</h2>

        <div className="manual-access-grid">
          <div className="manual-access-box">
            <h3>Grant Module Access</h3>

            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
            >
              <option value="">Select module</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>

            <button className="small-success-btn" onClick={grantModuleAccess}>
              Grant Module
            </button>
          </div>

          <div className="manual-access-box">
            <h3>Grant Full Package</h3>

            <select
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(e.target.value)}
            >
              <option value="">Select package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - ₹{pkg.price}
                </option>
              ))}
            </select>

            <button className="small-success-btn" onClick={grantPackageAccess}>
              Grant Package
            </button>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h2>Module Access</h2>

        <div className="table-card no-shadow">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Source</th>
                <th>Status</th>
                <th>Granted At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {student.accesses.map((access) => (
                <tr key={access.id}>
                  <td>{access.module.name}</td>
                  <td>{access.purchaseType}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        access.isActive ? "status-success" : "status-failed"
                      }`}
                    >
                      {access.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td>{new Date(access.createdAt).toLocaleString()}</td>
                  <td>
                    {access.isActive ? (
                      <button
                        className="small-danger-btn"
                        onClick={() => revokeAccess(access.module.id)}
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        className="small-success-btn"
                        onClick={() => restoreAccess(access.module.id)}
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {student.accesses.length === 0 && (
                <tr>
                  <td colSpan="5">No module access found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2>Test Attempts</h2>

        <div className="table-card no-shadow">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Module</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Score</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {student.attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.test.title}</td>
                  <td>{attempt.test.module.name}</td>
                  <td>{attempt.test.subject}</td>
                  <td>{attempt.status}</td>
                  <td>
                    {attempt.totalScore} / {attempt.test.totalMarks}
                  </td>
                  <td>
                    {attempt.submittedAt
                      ? new Date(attempt.submittedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="small-warning-btn"
                      onClick={() => allowReattempt(attempt.test.id)}
                    >
                      Allow Reattempt
                    </button>
                  </td>
                </tr>
              ))}

              {student.attempts.length === 0 && (
                <tr>
                  <td colSpan="7">No attempts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2>Payments</h2>

        <div className="table-card no-shadow">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Module/Package</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {student.payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.purchaseType}</td>
                  <td>
                    {payment.module?.name ||
                      payment.package?.name ||
                      "-"}
                  </td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.status}</td>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                </tr>
              ))}

              {student.payments.length === 0 && (
                <tr>
                  <td colSpan="5">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2>Device Sessions</h2>

        <div className="table-card no-shadow">
          <table>
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>

            <tbody>
              {student.sessions.map((session) => (
                <tr key={session.id}>
                  <td className="device-cell">{session.deviceId}</td>
                  <td>{session.isActive ? "ACTIVE" : "INACTIVE"}</td>
                  <td>{new Date(session.lastActiveAt).toLocaleString()}</td>
                </tr>
              ))}

              {student.sessions.length === 0 && (
                <tr>
                  <td colSpan="3">No sessions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDetail;
