import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = id || loggedInUser?.userId;

    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/${userId}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("User fetch error:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, loggedInUser]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/deletePost/${postId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          posts: prev.posts.filter((p) => p._id !== postId),
        }));
      }
    } catch (error) {
      alert("Failed to delete post.");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-danger fw-bold text-center mt-4">{error}</p>
    );

  return (
    <div className="container mt-4">

      {/* Profile Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8 text-center">

          <img
            src={user?.profileImage || "/default-image.png"}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />

          <h4 className="fw-bold">@{user?.userId}</h4>
          <h5 className="text-muted">{user?.Name}</h5>

          <div className="d-flex justify-content-center gap-4 mt-3">
            <div className="text-center">
              <h6 className="fw-bold">{user?.posts?.length || 0}</h6>
              <p className="text-muted small m-0">Posts</p>
            </div>

            <div className="text-center">
              <h6 className="fw-bold">{user?.followers || 0}</h6>
              <p className="text-muted small m-0">Followers</p>
            </div>

            <div className="text-center">
              <h6 className="fw-bold">{user?.following || 0}</h6>
              <p className="text-muted small m-0">Following</p>
            </div>
          </div>

        </div>
      </div>

      <hr />

      {/* Posts Section */}
      <h4 className="fw-bold text-center mb-3">Posts</h4>

      <div className="row g-4 justify-content-center">

        {user?.posts?.length > 0 ? (
          user.posts.map((post) => (
            <div key={post._id} className="col-12 col-md-6 col-lg-4">

              <div className="card shadow-sm">

                {/* Card Header */}
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={user?.profileImage || "/default-profile.png"}
                      alt="User"
                      className="rounded-circle me-2"
                      style={{ width: 45, height: 45, objectFit: "cover" }}
                    />
                    <strong>@{user?.userId}</strong>
                  </div>

                  {loggedInUser?.id === user?.userId && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>

                {/* Post Image */}
                <img
                  src={post.image || "/placeholder.png"}
                  alt="Post"
                  className="img-fluid"
                  style={{ maxHeight: 350, objectFit: "cover" }}
                />

                {/* Caption */}
                <div className="card-body">
                  <p className="mb-0">
                    <span className="fw-bold">@{user.userId}: </span>
                    {post.text}
                  </p>
                </div>

              </div>

            </div>
          ))
        ) : (
          <p className="text-center text-muted">No posts available.</p>
        )}
      </div>

    </div>
  );
};

export default Profile;
