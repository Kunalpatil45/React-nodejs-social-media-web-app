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

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/${userId}`
        );
        setUser(res.data);
      } catch (err) {
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, loggedInUser]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deletePost/${postId}`);

      setUser((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p._id !== postId),
      }));
    } catch {
      alert("Failed to delete post");
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"/></div>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container mt-4">

      {/* Profile Section */}
      <div className="text-center mb-4">
        <img
          src={user.profileImage}
          className="rounded-circle"
          style={{ width: 120, height: 120, objectFit: "cover" }}
          alt=""
        />

        <h4 className="fw-bold mt-2">@{user.userId}</h4>
        <h5 className="text-muted">{user.Name}</h5>

        <p className="mt-2 fw-bold">{user.posts?.length || 0} Posts</p>
      </div>

      <hr />

      {/* Posts */}
      <h4 className="fw-bold text-center mb-3">Posts</h4>

      <div className="row g-4 justify-content-center">

        {user.posts?.length > 0 ? (
          user.posts.map((post) => {
            // Detect new vs old post
            const mediaUrl = post.media || post.image;
            const mediaType =
              post.mediaType || (post.image ? "image" : "image");

            return (
              <div className="col-12 col-md-6 col-lg-4" key={post._id}>
                <div className="card shadow-sm">

                  {/* Header */}
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={user.profileImage}
                        className="rounded-circle me-2"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                        alt=""
                      />
                      <strong>@{user.userId}</strong>
                    </div>

                    {loggedInUser?.id === user?.userId && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(post._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>

                  {/* MEDIA BLOCK */}
                  <div className="bg-dark" style={{ height: 350 }}>

                    {mediaType === "image" && (
                      <img
                        src={mediaUrl}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    )}

                    {mediaType === "video" && (
                      <video
                        src={mediaUrl}
                        muted
                        playsInline
                        controls={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    )}

                  </div>

                  {/* Caption */}
                  <div className="card-body">
                    <p className="mb-0">
                      <strong>@{user.userId}:</strong> {post.text}
                    </p>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted">No posts available.</p>
        )}

      </div>
    </div>
  );
};

export default Profile;
