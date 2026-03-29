import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await API.post("/users/register", { name, email, password });
      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert("Error in registration");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-ring-1"></div>
        <div className="auth-ring-2"></div>
        <div className="auth-dot"></div>
        
        <div className="auth-left-content animate-fade-in-up">
          <h1 className="auth-brand-title">Join Our<br/>Community</h1>
          <p className="auth-brand-subtitle">Start building your portfolio today</p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-container animate-fade-in-up">
          <h2 className="auth-heading">Create Account</h2>
          <p className="auth-subheading">Join us to start building your portfolio</p>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label className="auth-label">FULL NAME</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            
            <div className="auth-input-group">
              <label className="auth-label">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            
            <div className="auth-input-group">
              <label className="auth-label">PASSWORD</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            
            <button type="submit" className="auth-button">
              Register
            </button>
          </form>
          
          <div className="auth-footer">
            Already have an account?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/")}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;