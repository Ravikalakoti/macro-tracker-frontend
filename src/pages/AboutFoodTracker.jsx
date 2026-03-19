// src/pages/AboutFoodTracker.jsx
import React from "react";
import "./AboutFoodTracker.css";

const AboutFoodTracker = () => {
  return (
    <div className="about-tracker-container">
      <div className="banner">
        <h1 className="fade-in">About Macro Tracker</h1>
        <p className="fade-in delay-1">
          Your tool to log meals and track fat, protein, and carbohydrates efficiently.
        </p>
      </div>

      <div className="features fade-in delay-2">
        <div className="feature-card">
          <h3>🍎 Food Tracking</h3>
          <p>Log meals and record nutritional macros for every food item.</p>
        </div>
        <div className="feature-card">
          <h3>🍽️ Meal Management</h3>
          <p>Create meals by combining foods and track your daily intake.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Visualize fat, protein, and carbs consumption trends over time.</p>
        </div>
      </div>

      <footer className="footer fade-in delay-3">
        <p>© 2026 Ravi Kalakoti</p>
      </footer>
    </div>
  );
};

export default AboutFoodTracker;