import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

import "./Feed.css";

const Feed = () => {
  
  const { user:loggedInUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("loggedInUser", loggedInUser);
  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts", {
          withCredentials: true,
        });

        console.log(response.data);
        if (response.status === 200) {
          setPosts(response.data);
        } else {
          setError("Failed to load posts.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-posts">
    <div className="post-grid">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="post-item">
            <div className="post-header">
              <img src={loggedInUser?.profileImage} alt="Profile" className="post-profile-image" />
              <p>{post.userId}</p>
            </div>
            <div className="imgcontainer">
              <img src={post.image} alt="Post" className="post-image" />
            </div>

            <div className="post-footer">
              <p className="description">{post.userId} {post.text}</p>
              
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
        
      )}
      </div>
    </div>
  );
};

export default Feed;
