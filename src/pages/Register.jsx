import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform form to match backend expected field names
    const payload = {
      username: form.username,
      fullName: form.full_name, // camelCase
      email: form.email,
      password: form.password,
    };

    try {
      const response = await API.post("/users/register", payload);
      toast.success("✅ Registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setTimeout(() => navigate("/login"), 3500);
    } catch (err) {
      console.error(err.response?.data);

      // If FastAPI sends validation errors, show them in toast
      if (err.response?.status === 422 && err.response?.data?.detail) {
        const messages = err.response.data.detail.map(d => `${d.loc[1]}: ${d.msg}`).join("\n");
        toast.error(`❌ Validation Error:\n${messages}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        toast.error(err.response?.data?.detail || "❌ Error registering", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div className="register-container">
      <div className="overlay">
        <div className="register-card fade-in">
          <h2 className="register-title">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="register-input"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="register-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="register-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="register-input"
              required
            />
            <button type="submit" className="register-button primary">
              Register
            </button>
          </form>
          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login" className="register-login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}