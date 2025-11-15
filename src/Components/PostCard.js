import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const PostCard = ({ post }) => {
  const videoRef = useRef(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Detect old vs new posts
  const mediaUrl = post.media || post.image;
  const mediaType = post.mediaType || (post.image ? "image" : null);

  // Auto-play in view
  useEffect(() => {
    if (mediaType !== "video" || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.65 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [mediaType]);

  // Like API
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/like-post/${post._id}`
      );
      setLikes(res.data.likes);
      setLiked(!liked);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Double tap like
  const handleDoubleTap = () => {
    handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 700);
  };

  return (
    <div className="col-12 col-md-10 col-lg-8 mx-auto mb-4">
      <div className="card shadow-sm">

        {/* Header */}
        <div className="card-body d-flex align-items-center">
          <img
            src={post.userId?.profileImage}
            alt="User"
            className="rounded-circle me-3"
            style={{ width: "45px", height: "45px", objectFit: "cover" }}
          />
          <h6 className="m-0 fw-bold">{post.userId?.Name}</h6>
        </div>

        {/* MEDIA */}
        <div
          className="position-relative"
          onDoubleClick={handleDoubleTap}
          style={{ background: "#000" }}
        >
          {/* HEART ANIMATION */}
          {showHeart && (
            <i
              className="fa-solid fa-heart position-absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "80px",
                color: "white",
                opacity: 0.9,
                animation: "pop 0.7s ease",
              }}
            ></i>
          )}

          {/* IMAGE */}
          {mediaType === "image" && (
            <img
              src={mediaUrl}
              className="img-fluid"
              alt="post"
              style={{
                width: "100%",
                maxHeight: "550px",
                objectFit: "contain",
                background: "#000",
              }}
            />
          )}

          {/* VIDEO */}
          {mediaType === "video" && (
            <div className="position-relative">
              <video
                ref={videoRef}
                src={mediaUrl}
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                onContextMenu={(e) => e.preventDefault()} // disable download
                style={{
                  width: "100%",
                  maxHeight: "550px",
                  objectFit: "contain",
                  pointerEvents: "none", // Hide default controls
                }}
              ></video>

              {/* MUTE BUTTON */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="btn btn-light position-absolute"
                style={{
                  bottom: "10px",
                  right: "10px",
                  padding: "6px 10px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                {isMuted ? (
                  <i className="fa-solid fa-volume-xmark"></i>
                ) : (
                  <i className="fa-solid fa-volume-high"></i>
                )}
              </button>
            </div>
          )}
        </div>

        {/* LIKE + CAPTION */}
        <div className="card-body">
          <div
            className="d-flex align-items-center mb-1"
            style={{ cursor: "pointer" }}
            onClick={handleLike}
          >
            <i
              className={`fa-solid fa-heart me-2 ${
                liked ? "text-danger" : "text-secondary"
              }`}
            ></i>
            <span>{likes} likes</span>
          </div>

          <p className="mb-0">
            <span className="fw-bold">{post.userId?.Name}: </span>
            {post.text}
          </p>
        </div>
      </div>

      {/* HEART ANIMATION CSS */}
      <style>{`
        @keyframes pop {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PostCard;
