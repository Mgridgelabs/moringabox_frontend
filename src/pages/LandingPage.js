import React from 'react'
import image1 from '../assets/1579fea7df32237ed18425c4b2984c84.png'
import image2 from '../assets/image _copy.png'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-Container">
        <img src={image1} alt="moringabox" id="moringabox1"/>
        <img src={image2} alt="logo" id="logo1"/>
        <h1 id="app-name">MORINGA BOX</h1>
        <p id="app-motto">Your modern solution for seamless cloud storage</p>
        <div className="landing-buttons">
            <button id="login-btn">Login</button>
            <button id="register-btn">Register</button>
        </div>
    </div>
  )
}

export default LandingPage