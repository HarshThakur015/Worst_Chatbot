import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Loginpage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/users/login", formData);
      if (response.status === 200) {
        // Store user data in localStorage or context if needed
        navigate("/chat");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="login-input"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
        />

        <div className="button-group">
          <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
          <button 
            className="login-button"
            onClick={handleLogin}
            disabled={!formData.username || !formData.password}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
