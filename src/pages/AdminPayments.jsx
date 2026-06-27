import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments/admin/all");
      setPayments(response.data.payments);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading payments...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Payment Records</h1>
        <p>View all student payment records.</p>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Item</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment ID</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.user.name}</td>
                <td>{payment.user.email}</td>
                <td>{payment.module?.name || payment.package?.name}</td>
                <td>{payment.purchaseType}</td>
                <td>₹{payment.amount}</td>
                <td>
                  <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                    {payment.status === "CREATED"
                      ? "PENDING / ABANDONED"
                      : payment.status}
                  </span>
                </td>
                <td>{payment.razorpayPaymentId || "-"}</td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="7">No payments yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
