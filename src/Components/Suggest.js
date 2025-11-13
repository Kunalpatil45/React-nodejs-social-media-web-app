import React, { useState, useEffect } from "react";
import axios from "axios";

const Suggest = () => {
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/recent-users`
        );

        if (response.status === 200) {
          setRecentUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };

    fetchRecentUsers();
  }, []);

  const handleUserClick = (userId) => {
    window.location.href = `/profile/${userId}`;
  };

  return (
    // ❌ Hidden on mobile: d-none  
    // ✔ Visible on md, lg, xl: d-md-block
    <div className="d-none d-md-block">

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title fw-bold">Popular Accounts</h5>

          {recentUsers.length > 0 ? (
            <ul className="list-group list-group-flush">

              {recentUsers.map((user) => (
                <li
                  key={user.userId}
                  className="list-group-item d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleUserClick(user.userId)}
                >
                  <img
                    src={user.profileImage || "/default-profile.png"}
                    alt={user.userId}
                    className="rounded-circle me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />

                  <span className="fw-semibold">{user.userId}</span>
                </li>
              ))}

            </ul>
          ) : (
            <p className="text-muted mt-3">No new users</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Suggest;
