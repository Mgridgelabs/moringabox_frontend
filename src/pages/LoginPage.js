import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back_img from '../assets/image _copy.png';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleBackClick = () => {
    navigate('/landing');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.access_token);
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="Loginpage-Container">
      <div className="mainContent">
        <img
          src={back_img}
          alt="back"
          id="back_img"
          onClick={handleBackClick}
          style={{ cursor: 'pointer' }}
        />
        <div className="login-Content">
          <h1 id="welcome-message">Welcome back! Glad to see you, Again!</h1>
          <form id="inputloginData" onSubmit={handleLogin}>
            <input
              name="email"
              type="text"
              placeholder="Enter your username:"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              name="password"
              type="password"
              placeholder="Enter your password:"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <p id="forgot_password">Forgot password?</p>
            <button type="submit" id="login-button">Login</button>
          </form>
          <p id="register-route">
            Don’t have an account?{' '}
            <span id="registerLink" onClick={handleRegisterClick}>
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
