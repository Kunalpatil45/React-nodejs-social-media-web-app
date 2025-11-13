import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard"; // Make sure path is correct

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts`,
          { withCredentials: true }
        );

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

  // Loading spinner
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">Loading posts...</p>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <p className="text-danger text-center mt-4 fw-bold">
        {error}
      </p>
    );
  }

  return (
    <div className="container mt-3">

      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      ) : (
        <p className="text-center text-muted fs-5">
          No posts available.
        </p>
      )}

    </div>
  );
};

export default Feed;
