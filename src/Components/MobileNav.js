import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const MobileNav = () => {
  const { user } = useContext(UserContext);
  //const location = useLocation();

  return (
    <div
      className="d-md-none"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      {/* HOME */}
      <Link to="/" className="text-dark text-center" style={{ textDecoration: "none" }}>
        <i className="ri-home-4-line" style={{ fontSize: "24px" }}></i>
      </Link>

      {/* SEARCH */}
      <Link to="/finduser" className="text-dark text-center" style={{ textDecoration: "none" }}>
        <i className="ri-search-line" style={{ fontSize: "24px" }}></i>
      </Link>

      {/* CREATE */}
      {user && (
        <Link to="/createpost" className="text-dark text-center" style={{ textDecoration: "none" }}>
          <i className="ri-add-circle-line" style={{ fontSize: "26px" }}></i>
        </Link>
      )}

      {/* PROFILE */}
      {user && (
        <Link to={`/profile/${user.id}`} className="text-dark text-center" style={{ textDecoration: "none" }}>
          <i className="ri-user-line" style={{ fontSize: "24px" }}></i>
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
