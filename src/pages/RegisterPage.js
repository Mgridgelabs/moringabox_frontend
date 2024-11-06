// src/pages/RegisterPage.js
import React, { useState } from 'react';
import './RegisterPage.css'; // Add styles for the Register page

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the registration logic here, like making an API call
    console.log('Form submitted:', formData);
  };

  return (
    <div className="register-container">
      <h1 id="register-title">Create Your Account</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" id="register-submit-btn">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
