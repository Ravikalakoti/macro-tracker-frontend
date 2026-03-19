import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("username", form.username);
    params.append("password", form.password);

    try {
      const res = await API.post("/users/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Save token
      localStorage.setItem("token", res.data.access_token);

      toast.success("✅ Logged in successfully!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => navigate("/dashboard"), 2600);
    } catch (err) {
      console.error(err.response?.data);

      // Show backend error nicely
      const message = err.response?.data?.detail || "❌ Invalid credentials";
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="overlay">
        <div className="login-card fade-in">
          <h2 className="login-title">Login to Macro Tracker</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="login-input"
              required
            />
            <button type="submit" className="login-button primary">
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
      <ToastContainer />
    </div>
  );
}