import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AboutFoodTracker from "./pages/AboutFoodTracker.jsx";
import AboutMe from "./pages/AboutMe.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />                      {/* Landing Page */}
        <Route path="/about-food-tracker" element={<AboutFoodTracker />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;