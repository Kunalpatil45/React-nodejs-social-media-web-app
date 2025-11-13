import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/Create" ||
    location.pathname === "/Create-uid";

  if (hideNavbar) return null;

  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
      <div className="container-fluid">

        {/* Brand / Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          SocialApp
        </Link>

        {/* Hamburger Menu */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="ri-home-4-line me-1"></i> Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/finduser">
                <i className="ri-search-line me-1"></i> Search
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/createpost">
                  <i className="ri-add-circle-line me-1"></i> Create
                </Link>
              </li>
            )}

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to={`/profile/${user.id}`}>
                  <i className="ri-shield-user-line me-1"></i> Profile
                </Link>
              </li>
            )}
          </ul>

          {/* Right side */}
          {user && (
            <button className="btn btn-outline-light" onClick={logout}>
              Logout <i className="ri-logout-box-r-line ms-1"></i>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
