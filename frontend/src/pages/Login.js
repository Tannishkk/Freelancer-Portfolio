import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const res = await API.post("/users/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("name", res.data.user.name);

      navigate("/dashboard/home");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        {/* Geometric rings */}
        <div className="auth-ring-1"></div>
        <div className="auth-ring-2"></div>
        {/* Crimson dot */}
        <div className="auth-dot"></div>
        
        <div className="auth-left-content animate-fade-in-up">
          <h1 className="auth-brand-title">Freelance<br/>Platform</h1>
          <p className="auth-brand-subtitle">Discover top talents and amazing projects</p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-container animate-fade-in-up">
          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-subheading">Please enter your details to sign in</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            
            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>
          
          <div className="auth-footer">
            Don't have an account?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/register")}
            >
              Create account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;