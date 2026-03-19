import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        // alert("Unauthorized");
        navigate("/");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Dashboard</h2>
        {user ? (
          <>
            <p className="dashboard-info">Username: {user.username}</p>
            <p className="dashboard-info">Email: {user.email}</p>
            <button className="dashboard-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}