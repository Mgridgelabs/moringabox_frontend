// src/pages/LandingPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image1 from '../assets/1579fea7df32237ed18425c4b2984c84.png';
import image2 from '../assets/image _copy.png';
import './LandingPage.css';

function LandingPage() {
    // Initialize the navigate function
    const navigate = useNavigate(); 

    // Function to handle login button click
    const handleLoginClick = () => {
        navigate('/login');
    };
  return (
    <div className="landing-Container">
        <img src={image1} alt="moringabox" id="moringabox1"/>
        <img src={image2} alt="logo" id="logo1"/>
        <h1 id="app-name">MORINGA BOX</h1>
        <p id="app-motto">Your modern solution for seamless cloud storage</p>
        <div className="landing-buttons">
            <button id="login-btn" onClick={handleLoginClick}>Login</button>
            <Link to="/register">
              <button id="register-btn">Register</button>
            </Link>
        </div>
    </div>
  );
}

export default LandingPage;
