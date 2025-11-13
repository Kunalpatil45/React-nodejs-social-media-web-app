import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="col-12 col-md-10 col-lg-8 mx-auto mb-4">
      <div className="card shadow-sm">

        {/* Header */}
        <div className="card-body d-flex align-items-center">
          <img
            src={post.userId?.profileImage || "/default-profile.png"}
            alt="User"
            className="rounded-circle me-3"
            style={{
              width: "45px",
              height: "45px",
              objectFit: "cover",
            }}
          />
          <h6 className="m-0 fw-bold">
            {post.userId?.Name || "Unknown User"}
          </h6>
        </div>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="img-fluid"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
        )}

        {/* Description */}
        <div className="card-body">
          <p className="mb-0">
            <span className="fw-bold">{post.userId?.Name}: </span>
            {post.text}
          </p>
        </div>

      </div>
    </div>
  );
};

export default PostCard;
