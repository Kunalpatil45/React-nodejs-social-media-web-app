import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const MobileNav = () => {
  const { user } = useContext(UserContext);

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
      <Link to="/" className="text-dark" style={{ textDecoration: "none" }}>
        <i className="ri-home-4-line" style={{ fontSize: "24px" }} />
      </Link>

      <Link to="/finduser" className="text-dark" style={{ textDecoration: "none" }}>
        <i className="ri-search-line" style={{ fontSize: "24px" }} />
      </Link>

      {user && (
        <Link to="/createpost" className="text-dark" style={{ textDecoration: "none" }}>
          <i className="ri-add-circle-line" style={{ fontSize: "26px" }} />
        </Link>
      )}

      {user && (
        <Link to={`/profile/${user.id}`} className="text-dark" style={{ textDecoration: "none" }}>
          <i className="ri-user-line" style={{ fontSize: "24px" }} />
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
