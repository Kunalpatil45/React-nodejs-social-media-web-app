import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FindUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setError("");
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const q = encodeURIComponent(searchQuery.trim());
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/searchUser/${q}`
        );

        if (!Array.isArray(response.data) || response.data.length === 0) {
          setUsers([]);
          setError("No users found.");
        } else {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Search error:", err);
        setUsers([]);
        setError("Failed to fetch users. Try again.");
      } finally {
        setLoading(false);
      }
    };

    const id = setTimeout(fetchUsers, 500); // debounce 500ms
    return () => clearTimeout(id);
  }, [searchQuery]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          {/* Search box */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by user ID or name..."
              aria-label="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearchQuery("")}
              title="Clear"
            >
              Clear
            </button>
          </div>

          <hr />

          {/* Loading / Error */}
          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border" role="status" aria-hidden="true"></div>
              <div className="small text-muted mt-2">Searching...</div>
            </div>
          )}

          {error && !loading && (
            <div className="alert alert-warning py-2">{error}</div>
          )}

          {/* Results */}
          {!loading && users.length > 0 && (
            <ul className="list-group">
              {users.map((user) => (
                <li
                  key={user.userId}
                  className="list-group-item list-group-item-action d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleUserClick(user.userId)}
                >
                  <img
                    src={user.profileImage || "/default-profile.png"}
                    alt={user.Name || user.userId}
                    className="rounded-circle me-3"
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      {user.Name || "Unknown"}
                    </div>
                    <div className="text-muted">@{user.userId}</div>
                  </div>

                  <div className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${user.userId}`);
                      }}
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* No results message when empty and no error */}
          {!loading && !error && users.length === 0 && searchQuery.trim() !== "" && (
            <p className="text-center text-muted">No users match your search.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default FindUser;
