import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import back_img from '../assets/back_img.png';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the click event
  const handleBackClick = () => {
    navigate('/landing'); // Navigate to the Landing Page
  };

  return (
    <div className="Loginpage-Container">
      <div className="mainContent">
        {/* Clickable background image */}
        <img 
          src={back_img} 
          alt="back" 
          id="back_img" 
          onClick={handleBackClick} // Trigger the navigation when clicked
          style={{ cursor: 'pointer' }} // Add cursor style to indicate it's clickable
        />

        <div className="login-Content">
          <h1 id="welcome-message">
            Welcome back! Glad to see you, Again!
          </h1>

          {/* Login Form */}
          <form id="inputloginData">
            <input name="email" type="email" placeholder="Enter your email:" required />
            <input name="password" type="password" placeholder="Enter your password:" required />
            <p id="forgot_password">Forgot password?</p>
            <button type="submit" id="login-button">Login</button>
          </form>

          {/* Register route */}
          <p id="register-route">
            Don’t have an account? <span id="registerLink">Register Now</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
