import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
<img src="/google.png" alt="Logo" className="login-logo" />


export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (email) {
      navigate("/password", { state: { email } });// next page for password
    } else {
      alert("Please enter your email or phone.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-wrapper">
        <img src="/google.png" alt="Logo" className="login-logo" />
        </div>
        <h2 className="login-title">Sign in</h2>
        <p className="login-subtitle">to continue to Gmail</p>
        <form onSubmit={handleNext} className="login-form">
          <input
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <div className="login-link">Forgot email?</div>

          <div className="login-info-text">
            Not your computer? Use a private browsing window to sign in. <br/>
            <span className="bluetag">Learn more about using Guest mode </span>
            </div>


          <div className="login-actions">
            <button
              type="button"
              className="create-account"
              onClick={() => alert("Create account flow here")}
            >
              Create account
            </button>
            <button type="submit" className="next-button">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
