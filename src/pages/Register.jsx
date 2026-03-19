import { useState } from "react";
import API from "../api"; // Your Axios instance
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; // custom CSS

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", form);
      alert("Registered successfully!");
      navigate("/"); // go to login
    } catch (err) {
      alert(err.response?.data?.detail || "Error registering");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="register-input"
          />
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="register-input"
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="register-login-text">
          Already have an account?{" "}
          <Link to="/" className="register-login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}