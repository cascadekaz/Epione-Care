import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient"); // Default to Patient
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    setSuccessMsg("");

    try{
      const response = await axios.post("http://localhost:8000/api/auth/login",{
        email,
        password,
      });

      const {token, user}= response.data;

      if(user.role!== role){
        setError(`You're logging in a wrong role!`);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user._id);

      window.dispatchEvent(new Event("roleChange"));

      setSuccessMsg("Login Successful!");

      navigate(user.role === 'patient'? "/patient-dashboard" : "/doctor-dashboard")
    }catch (err){
      const msg = err.response?.data?.message || "Login failed. Try again.";
      setError(msg);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {/* Role Selection */}
      <div className="role-selection">
        <button className={role === "patient" ? "active" : ""} onClick={() => setRole("patient")}>
          Patient
        </button>
        <button className={role === "doctor" ? "active" : ""} onClick={() => setRole("doctor")}>
          Doctor
        </button>
      </div>
      {/* Display Error Message */}
      {error && <p className="error-message">{error}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="login-form">
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

        <button type="submit" className="login-button">Login as {role}</button>
      </form>

      {/* Signup Option */}
      <p className="signup-option">
        Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
      </p>
    </div>
  );
};

export default Login;