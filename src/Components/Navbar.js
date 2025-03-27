

import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import "./navbar.css";
import { useLocation } from "react-router-dom";


const Navbar = () => {
  const { user } = useContext(UserContext);
 console.log("User in Navbar:", user);
  

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/logout", { 
        method: "POST", 
        credentials: "include" 
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user"); 

      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  

  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/Create" || location.pathname === "/Create-uid";

  if (hideNavbar) return null;

  return (
    <nav className="navbar">
      <ul>
        <Link to="/" className="nav-link"><li><div className="link"><i className="ri-home-4-line"></i> Home</div></li></Link>
        <Link to="/finduser" className="nav-link"><li><div className="link"><i className="ri-search-line"></i> Search</div></li></Link>
        {user && <Link to="/createpost" className="nav-link"><li><div className="link"><i className="ri-add-circle-line"></i> Create</div></li></Link>}
        {user && <Link to={`/profile/${user.id}`} className="nav-link"><li><div className="link"><i className="ri-shield-user-line"></i> Profile</div></li></Link>}
      </ul>
        <button className="log-out" onClick={logout}>Logout <i class="ri-logout-box-r-line"></i></button>
    </nav>
  );
};

export default Navbar;  