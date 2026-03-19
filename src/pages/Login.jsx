import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("username", form.username);
    params.append("password", form.password);

    try {
      const res = await API.post("/users/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Save token
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="login-register-text">
          Don't have an account?{" "}
          <Link to="/register" className="login-register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}