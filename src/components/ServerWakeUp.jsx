import { useEffect, useState } from "react";

const ServerWakeUp = () => {
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    const wakeServer = async () => {
      try {
        setWaking(true);

        const wakeUrl =
          import.meta.env.VITE_BACKEND_WAKE_URL || "http://localhost:5000";

        await fetch(wakeUrl, {
          method: "GET",
          cache: "no-store"
        });
      } catch (error) {
        console.log("Backend wake-up request failed");
      } finally {
        setWaking(false);
      }
    };

    wakeServer();
  }, []);

  if (!waking) {
    return null;
  }

  return (
    <div className="server-wakeup-banner">
      Starting server, please wait a few seconds...
    </div>
  );
};

export default ServerWakeUp;
