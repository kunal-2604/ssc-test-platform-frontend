import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminModules = () => {
  const [summary, setSummary] = useState(null);
  const [modules, setModules] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const response = await api.get("/modules/admin/summary");

      setSummary(response.data.summary);
      setModules(response.data.modules);
      setPackages(response.data.packages);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading admin modules...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Admin Modules</h1>
        <p>View available subject modules and package pricing.</p>
      </div>

      {summary && (
        <div className="summary-grid">
          <div>
            <strong>{summary.totalModules}</strong>
            <span>Total Modules</span>
          </div>

          <div>
            <strong>{summary.totalPackages}</strong>
            <span>Total Packages</span>
          </div>

          <div>
            <strong>₹{summary.individualModuleTotalPrice}</strong>
            <span>Individual Total</span>
          </div>

          <div>
            <strong>₹{summary.fullPackagePrice}</strong>
            <span>Full Package</span>
          </div>
        </div>
      )}

      <section>
        <h2>Modules</h2>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Subjects</th>
                <th>Tests</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {modules.map((module) => (
                <tr key={module.id}>
                  <td>{module.name}</td>
                  <td>{module.subjects.join(", ")}</td>
                  <td>{module.totalTests}</td>
                  <td>₹{module.price}</td>
                  <td>{module.isActive ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="package-section">
        <h2>Packages</h2>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Package</th>
                <th>Included Modules</th>
                <th>Total Tests</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.name}</td>
                  <td>
                    {pkg.packageModules
                      .map((item) => item.module.name)
                      .join(", ")}
                  </td>
                  <td>{pkg.totalTests}</td>
                  <td>₹{pkg.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminModules;
