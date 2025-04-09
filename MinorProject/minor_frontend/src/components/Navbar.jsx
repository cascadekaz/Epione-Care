
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from '../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));


  
  // 🛠 Define this function BEFORE useEffect
  const handleRoleChange = () => {
    setUserRole(localStorage.getItem("role"));
  };

  useEffect(() => {
    handleRoleChange(); // Initial role sync

    window.addEventListener("roleChange", handleRoleChange);
    window.addEventListener("storage", handleRoleChange); // For other tabs

    return () => {
      window.removeEventListener("roleChange", handleRoleChange);
      window.removeEventListener("storage", handleRoleChange);
    };
  }, []);


  const handleLogoClick = () => {
    navigate('/');
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("roleChange")); // Notify all listeners
    setUserRole(null);
    navigate("/login");
  };


  // Determine Dashboard Route
  const getDashboardRoute = () => {
    if (userRole === "patient") return "/patient-dashboard";
    if (userRole === "doctor") return "/doctor-dashboard";
    return "/login"; // Default to login if no role found

  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <img
        src={logo}
        alt="logo"
        className="logo"
        onClick={handleLogoClick}
        onError={(e) => (e.target.style.display = "none")} // Hide if logo fails to load
      />

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>About Us</NavLink>
        </li>

        {userRole === "patient" && (
          <>
            <li>
              <NavLink to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
            </li>
            <li>
              <NavLink to={getDashboardRoute()} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/book-now" onClick={() => setMenuOpen(false)}>Book Appointment</NavLink>
            </li>
          </>
        )}

        {userRole === "doctor" && (
          <>
            <li>
              <NavLink to="/view-patients" onClick={() => setMenuOpen(false)}>View Patients</NavLink>
            </li>
            <li>
              <NavLink to={getDashboardRoute()} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Auth Buttons */}
      <div className="nav-buttons">
        {!userRole ? (
          <>
            <button className="login" onClick={() => navigate("/login")}>Log in</button>
            <button className="signup" onClick={() => navigate("/signup")}>Sign up</button>
          </>
        ) : (
          <button className="logout" onClick={handleLogout}>Log out</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;