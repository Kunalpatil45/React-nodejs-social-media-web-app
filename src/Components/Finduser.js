import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import axios from "axios";
import "./Finduser.css";

const FindUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]); // Clear results when input is empty
      setError("");
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`http://localhost:5000/searchUser/${searchQuery}`);
        if (response.data.length === 0) {
          setError("No users found.");
        }
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchUsers, 500); // Debounce API calls

    return () => clearTimeout(debounceTimeout); // Cleanup on re-render
  }, [searchQuery]);

  // Function to navigate to the user's profile page
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // Redirect to profile page
  };

  return (
    <div className="finduser">
      <div className="search-box">
      <input 
        type="text" 
        placeholder="Enter User ID" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
        
      />

      </div>
      
      
      <hr />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Display User List */}
      <div className="user-list">
        {users.length > 0 && (
          <ul>
            {users.map((user) => (
              <li key={user.userId} onClick={() => handleUserClick(user.userId)}>
                <img src={user.profileImage} alt="Profile" width="80" height="80" />
                <div className="user-info">
                <div>{user.Name} </div>
                <p>@{user.userId}</p>
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FindUser;
