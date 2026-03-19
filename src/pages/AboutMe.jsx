// src/pages/AboutMe.jsx
import React from "react";
import "./AboutMe.css";
import profilePic from "../assets/profile.jpg"; // your profile image

// You can use react-icons for icons: npm install react-icons
import { FaLinkedin, FaGithub } from "react-icons/fa";

const AboutMe = () => {
  return (
    <div className="about-container">
      <div className="about-banner">
        <h1 className="fade-in">About Me</h1>
      </div>

      <div className="about-content">
        <div className="profile-card fade-in delay-1">
          <img src={profilePic} alt="Ravi Kalakoti" className="profile-pic" />
          <div className="profile-info">
            <h2>Ravi Kalakoti</h2>
            <p>
              Hi! I'm Ravi Kalakoti, the creator of <strong>Macro Tracker</strong>.  
              This project is my passion for nutrition tracking, health, and building intuitive web applications.
            </p>
            <p>
              I love combining <strong>React</strong> frontends with <strong>FastAPI</strong> backends to create fast, responsive, and user-friendly apps.
            </p>

            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/ravi-kalakoti/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href="https://github.com/Ravikalakoti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaGithub size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="about-footer fade-in delay-2">
        <p>© 2026 Ravi Kalakoti</p>
      </footer>
    </div>
  );
};

export default AboutMe;