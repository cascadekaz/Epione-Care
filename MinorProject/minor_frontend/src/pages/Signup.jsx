import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient"); // Default to patient
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (response.data.token) {
        setSuccessMsg("Register Successfully!");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong!";
      setError(msg);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>

      {/* Role Selection */}
      <div className="role-selection">
        <button className={role === "patient" ? "active" : ""} onClick={() => setRole("patient")}>
          Patient
        </button>
        <button className={role === "doctor" ? "active" : ""} onClick={() => setRole("doctor")}>
          Doctor
        </button>
      </div>

      {/* Error or Success Message */}
      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
      {/* Sign-Up Form */}
      <form onSubmit={handleSubmit} className="signup-form">
        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="signup-button">Sign Up as {role}</button>
      </form>

      {/* Login Option */}
      <p className="login-option">
        Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
      </p>
    </div>
  );
};

export default SignUp;