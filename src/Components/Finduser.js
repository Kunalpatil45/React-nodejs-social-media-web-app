import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./Finduser.css";

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/searchUser/${searchQuery}`);
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

    const debounceTimeout = setTimeout(fetchUsers, 500); 

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

 
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); 
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
