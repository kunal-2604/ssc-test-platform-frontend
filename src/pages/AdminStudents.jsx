import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async (searchValue = "") => {
    try {
      const response = await api.get(
        `/admin/students${searchValue ? `?search=${searchValue}` : ""}`
      );

      setStudents(response.data.students);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchStudents(search);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading students...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Students</h1>
        <p>View and manage registered students.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Search</button>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            fetchStudents("");
          }}
        >
          Clear
        </button>
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Accesses</th>
              <th>Attempts</th>
              <th>Total Paid</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone || "-"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      student.isActive ? "status-success" : "status-failed"
                    }`}
                  >
                    {student.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td>{student.activeAccessCount}</td>
                <td>{student.attemptCount}</td>
                <td>₹{student.totalPaidAmount}</td>
                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/admin/students/${student.id}`}
                    className="small-primary-btn"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="9">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudents;
