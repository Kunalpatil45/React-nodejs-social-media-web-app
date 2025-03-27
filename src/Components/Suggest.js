import React, { useState, useEffect } from "react";
import axios from "axios";
import "./suggestion.css";

const Suggest = () => {
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recent-users"); 
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
    <div className="boxx">
      <h2>Recently Joined</h2>
      {recentUsers.length > 0 ? (
        <ul className="recent-users">
          {recentUsers.map((user) => (
            <li
              key={user.userId}
              className="user-item"
              onClick={() => handleUserClick(user.userId)}
            >
              <img
                src={user.profileImage || "/default-profile.png"}
                alt={user.userId}
                className="user-image"
              />
              <span className="user-id">{user.userId}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No new users</p>
      )}
    </div>
  );
};

export default Suggest;
