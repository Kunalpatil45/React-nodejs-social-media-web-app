

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./profile.css";




const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = id || loggedInUser?.userId;
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, loggedInUser]);

 

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profileContainer">
      <div className="user-profile-image">
        <img 
          src={user?.profileImage || "/default-image.png"} 
          alt="Profile" 
          className="profile-pic"
        />
      </div>

      <p className="User-id">{user?.userId || "No ID available"}</p>
      <p className="User-name">{user?.Name || "No name available"}</p>

    
      <div className="user-details">
        <div className="user-post">{user?.posts?.length || 0} Posts</div>
        <div className="user-follower">{user?.followers || 0} Followers</div>
        <div className="user-following">{user?.following || 0} Following</div>
      </div>
      <hr />
      <h2>Posts</h2>
      <div className="user-posts">
        {user?.posts?.length > 0 ? (
          <div className="post-grid">
            {user.posts.map((post) => (
              <div key={post._id} className="post-item">
                <div className="post-header">
                  <img
                    src={user?.profileImage || "/default-profile.png"}
                    alt="User Profile"
                    className="post-profile-image"
                  />
                  <p>{user.userId}</p>
                </div>

                <div className="imgcontainer">
                  <img
                    src={post.image || "/placeholder.png"}
                    alt="Post"
                    className="post-image"
                  />
                </div>

                <div className="post-footer">
                  <p className="description">
                    {user.userId} {post.text}
                  </p>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
    
    
  );
};

export default Profile;
