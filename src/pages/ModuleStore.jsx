import { useEffect, useState } from "react";
import api from "../api/axios";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const ModuleStore = () => {
  const [modules, setModules] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoadingId, setPaymentLoadingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStoreItems = async () => {
    try {
      const response = await api.get("/modules/store");

      setModules(response.data.modules);
      setPackages(response.data.packages);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const handlePayment = async ({ purchaseType, moduleId, packageId }) => {
    try {
      setError("");
      setSuccess("");
      setPaymentLoadingId(moduleId || packageId);

      const isLoaded = await loadRazorpayScript();

      if (!isLoaded) {
        setError("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      const orderResponse = await api.post("/payments/create-order", {
        purchaseType,
        moduleId,
        packageId
      });

      const { keyId, order, user } = orderResponse.data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "SSC Test Platform",
        description:
          purchaseType === "MODULE"
            ? "Subject Module Purchase"
            : "Full Package Purchase",
        order_id: order.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ""
        },
        theme: {
          color: "#2563eb"
        },
        handler: async function (response) {
          try {
            const verifyResponse = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            setSuccess(verifyResponse.data.message);
            await fetchStoreItems();
          } catch (error) {
            setError(
              error.response?.data?.message || "Payment verification failed"
            );
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentLoadingId("");
          }
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async function (response) {
        try {
          await api.post("/payments/mark-failed", {
            razorpay_order_id: response.error.metadata.order_id,
            error: {
              code: response.error.code,
              description: response.error.description,
              reason: response.error.reason
            }
          });
        } catch (error) {
          console.log("Failed to update payment status");
        }

        setError(response.error.description || "Payment failed");
        setPaymentLoadingId("");
        await fetchStoreItems();
      });

      razorpay.open();
    } catch (error) {
      setError(error.response?.data?.message || "Payment failed");
    } finally {
      setPaymentLoadingId("");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading modules...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Buy Test Series</h1>
        <p>Select a subject module or buy the full package at discounted price.</p>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <section>
        <h2>Subject Modules</h2>

        <div className="module-grid">
          {modules.map((module) => (
            <div className="module-card" key={module.id}>
              <div>
                <h3>{module.name}</h3>
                <p>{module.description}</p>

                <div className="subject-list">
                  {module.subjects.map((subject) => (
                    <span key={subject}>{subject}</span>
                  ))}
                </div>
              </div>

              <div className="module-footer">
                <div>
                  <strong>{module.totalTests}</strong>
                  <span>Tests</span>
                </div>

                <div>
                  <strong>₹{module.price}</strong>
                  <span>Price</span>
                </div>
              </div>

              {module.hasAccess ? (
                <button className="access-btn" disabled>
                  Access Active
                </button>
              ) : (
                <button
                  className="buy-btn"
                  disabled={paymentLoadingId === module.id}
                  onClick={() =>
                    handlePayment({
                      purchaseType: "MODULE",
                      moduleId: module.id
                    })
                  }
                >
                  {paymentLoadingId === module.id
                    ? "Processing..."
                    : `Buy Now ₹${module.price}`}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="package-section">
        <h2>Best Value Package</h2>

        <div className="package-grid">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <div className="package-badge">Best Value</div>

              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>

              <div className="package-modules">
                {pkg.modules.map((module) => (
                  <span key={module.id}>{module.name}</span>
                ))}
              </div>

              <div className="price-row">
                <div>
                  <strong>{pkg.totalTests}</strong>
                  <span>Total Tests</span>
                </div>

                <div>
                  <strong>₹{pkg.price}</strong>
                  <span>Package Price</span>
                </div>
              </div>

              <p className="saving-text">
                Individual total is ₹560. You pay only ₹500.
              </p>

              {pkg.hasAccess ? (
                <button className="access-btn" disabled>
                  Full Access Active
                </button>
              ) : (
                <button
                  className="buy-btn package-buy-btn"
                  disabled={paymentLoadingId === pkg.id}
                  onClick={() =>
                    handlePayment({
                      purchaseType: "PACKAGE",
                      packageId: pkg.id
                    })
                  }
                >
                  {paymentLoadingId === pkg.id
                    ? "Processing..."
                    : "Buy Full Package ₹500"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ModuleStore;
