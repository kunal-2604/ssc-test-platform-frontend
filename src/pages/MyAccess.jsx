import { useEffect, useState } from "react";
import api from "../api/axios";

const MyAccess = () => {
  const [accesses, setAccesses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccess = async () => {
    try {
      const accessResponse = await api.get("/payments/my-access");
      const paymentResponse = await api.get("/payments/my-payments");

      setAccesses(accessResponse.data.accesses);
      setPayments(paymentResponse.data.payments);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to load access");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading access...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>My Access</h1>
        <p>View your purchased test series and payment history.</p>
      </div>

      <section>
        <h2>Active Access</h2>

        <div className="module-grid">
          {accesses.length === 0 && <p>No active access yet.</p>}

          {accesses.map((access) => (
            <div className="module-card" key={access.id}>
              <h3>{access.module.name}</h3>
              <p>{access.module.description}</p>

              <div className="subject-list">
                {access.module.subjects.map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
              </div>

              <div className="module-footer">
                <div>
                  <strong>{access.module.totalTests}</strong>
                  <span>Tests</span>
                </div>

                <div>
                  <strong>{access.purchaseType}</strong>
                  <span>Purchased Via</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="package-section">
        <h2>Payment History</h2>

        <div className="table-card">
          <table>
            <thead>
              <tr>
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
                  <td>{payment.module?.name || payment.package?.name}</td>
                  <td>{payment.purchaseType}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.status}</td>
                  <td>{payment.razorpayPaymentId || "-"}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="5">No payments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MyAccess;
