import React from 'react';
import { useNavigate } from 'react-router-dom';
import back_img from '../assets/back_img.png'
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the click event
  const handleBackClick = () => {
    navigate('/landing'); // Navigate to the Landing Page
  };

  const handleLoginClick = () => {
    navigate('/login')
  }
  return (
    <div className="Registerpage-Container">
        <div className="registermainContent">
        <img src={back_img} alt="back" id="registerback_img" onClick={handleBackClick} style={{ cursor: 'pointer' }} />
        <div className="register-Content">
            <h1 id="welcome-message2">Welcome back! Glad to see you, Again!</h1>
            <form id="inputregisterData">
                <input name="username" placeholder="Username" />
                <input name="email" placeholder="Email" />
                <input name="password" placeholder="Password" />
                <input name="confirm_password" placeholder="Confirm password" />
                <button type="submit" id="register-button">Login</button>
            </form>
            <p id="login-route">Already have an account? <span id="loginLink" onClick={handleLoginClick}>Login Now</span></p>
        </div>
        </div>
    </div>
  );
}

export default RegisterPage;
