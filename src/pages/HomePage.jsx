import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(false);

  // Handle API Docs click
  const handleApiClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // prevent navigating to API docs
      setShowMessage(true); // show modal
    } else {
      window.open("https://fastapi-macro-tracker.onrender.com/docs", "_blank", "noopener,noreferrer");
    }
  };

  const closeMessage = () => setShowMessage(false);

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar fade-in">
        <div className="nav-left">
          <h2>🍽️ Macro Tracker</h2>
        </div>
        <div className="nav-right">
          <Link to="/about-food-tracker" className="nav-link">About Tracker</Link>
          <Link to="/about-me" className="nav-link">About Me</Link>
          <button
            className="nav-link api-link button-link"
            onClick={handleApiClick}
          >
            API Docs
          </button>
          <Link to={isLoggedIn ? "/dashboard" : "/login"} className="nav-link primary">
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="overlay hero fade-in delay-1">
        <h1>Welcome to Macro Tracker</h1>
        <p>Track your meals, macros, and progress easily!</p>

        <div className="hero-buttons">
          {isLoggedIn ? (
            <Link to="/dashboard" className="home-button primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="home-button primary">Login</Link>
              <Link to="/register" className="home-button secondary">Register</Link>
            </>
          )}
        </div>
      </section>

      {/* About Sections */}
      <section className="section fade-in delay-2">
        <h2>🍎 About the Food Tracker</h2>
        <p>
          Log your meals and track your nutritional intake – fat, protein, and carbs – all in one place.
          Designed to be fast, responsive, and user-friendly, with real-time updates from the backend.
        </p>
        <Link to="/about-food-tracker" className="home-button secondary">Learn More</Link>
      </section>

      <section className="section fade-in delay-3">
        <h2>👤 About the Creator</h2>
        <p>
          Created by <strong>Ravi Kalakoti</strong>, passionate about nutrition, health, and building fast, intuitive web apps.
        </p>
        <Link to="/about-me" className="home-button secondary">Learn More About Me</Link>
      </section>

      {/* API Docs Section */}
      <section className="section fade-in delay-4">
        <h2>⚡ API Access</h2>
        <p>Developers can explore the backend API via Swagger UI or ReDoc.</p>
        <button
          className="home-button api-link button-link"
          onClick={handleApiClick}
        >
          View API Docs
        </button>
      </section>

      {/* Footer */}
      <footer className="home-footer fade-in delay-5">
        <p>© 2026 Ravi Kalakoti | <Link to="/about-me">Contact Me</Link></p>
      </footer>

      {/* Modal Message */}
      {showMessage && (
        <div className="modal-overlay" onClick={closeMessage}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <p>Please login to access the API documentation.</p>
            <button className="modal-close-button" onClick={closeMessage}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;