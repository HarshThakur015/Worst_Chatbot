import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./SignupPage.css";

const Signup = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    age: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if all fields are filled
  const isFormComplete = Object.values(formData).every((val) => val.trim() !== "");

  // Handle sign-up
  const handleSignup = async () => {
    if (!isFormComplete) {
      alert("⚠️ Please fill in all fields before signing up.");
      return;
    }
  
    console.log("🔍 Sending Data to Backend:", formData); // ✅ Log request data
  
    try {
      const response = await axios.post("http://localhost:8000/users/signup", formData, {
        headers: {
          "Content-Type": "application/json", // ✅ Ensure JSON format
        },
      });
  
      if (response.status === 201) {
        alert("✅ Signup successful! Redirecting to chat...");
        navigate("/chat"); // Redirect to chat page
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      console.error("⚠️ Response Data:", error.response?.data);
      alert("❌ Signup failed. Please try again.");
    }
  };
  
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>

        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="signup-input" />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="signup-input" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="signup-input" />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="signup-input" />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} className="signup-input" />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          className="signup-input" 
        />

        <div className="button-group">
          <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
          <button 
            className="signup-button"
            onClick={handleSignup} 
            disabled={!isFormComplete}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
