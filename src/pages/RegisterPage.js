import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back_img from '../assets/image _copy.png';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);

  const handleBackClick = () => {
    navigate('/landing');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://cloudy-wiwu.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, navigate to login page
        alert("Registration successful. Please log in.");
        navigate('/login');
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="Registerpage-Container">
      <div className="registermainContent">
        <img src={back_img} alt="back" id="registerback_img" onClick={handleBackClick} style={{ cursor: 'pointer' }} />
        <div className="register-Content">
          <h1 id="welcome-message2">Hello! Register to get started</h1>
          <form id="inputregisterData" onSubmit={handleRegister}>
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" id="register-button">Register</button>
          </form>
          <p id="login-route">Already have an account? <span id="loginLink" onClick={handleLoginClick}>Login Now</span></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
