import React, { useState } from "react";
import "./App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      const response = await fetch(
        "https://resumefit-ai-36t5.onrender.com/api/auth/register",        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Something went wrong during registration.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>ResumeFit AI</h1>

        <h2>Create Your Account</h2>

        <p className="auth-subtitle">
          Create an account to start analyzing your resume.
        </p>

        <div className="auth-form">
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleRegister}>
            Create Account
          </button>
        </div>

        <p className="auth-footer">
          Already have an account?

          <button
            className="auth-link"
            onClick={() => window.location.href = "/login"}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;