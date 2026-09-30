import React, { useState } from "react";
import "./App.css";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await fetch(
        "https://resumefit-ai-36t5.onrender.com/api/auth/login",        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword
          })
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Something went wrong during login.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>ResumeFit AI</h1>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to continue to your dashboard.
        </p>

        <div className="auth-form">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account?
          <button
            className="auth-link"
            onClick={() => window.location.href = "/register"}
          >
            Create an account
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;