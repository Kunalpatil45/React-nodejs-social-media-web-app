/* import React,{ useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./navbar.css";

const Navbar = () => {
  const { user } = useContext(UserContext);
  console.log(user);

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/logout", { 
        method: "POST", 
        credentials: "include" 
      });

      localStorage.removeItem("token");  
      localStorage.removeItem("Uid"); 

      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <nav className="navbar">
      
      <li><Link to="/">Home</Link></li>
      {<li><Link to={`/profile/${user.id}`}>Profile</Link></li>}
      <li><Link to="/feed">Feed</Link></li>
      <button className="log-out" onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar; */

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./navbar.css";

const Navbar = () => {
  const { user } = useContext(UserContext);
  

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/logout", { 
        method: "POST", 
        credentials: "include" 
      });

      localStorage.removeItem("token");  // ✅ Remove only token
      localStorage.removeItem("user"); // ✅ Remove only userId

      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/finduser">Search</Link></li>
        {user && <li><Link to={`/profile/${user.id}`}>Profile</Link></li>}
        <li><Link to="/feed">Feed</Link></li>
        <li><button className="log-out" onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;