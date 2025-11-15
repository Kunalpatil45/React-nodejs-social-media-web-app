import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const CreatePost = () => {
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [previewType, setPreviewType] = useState(""); // image | video
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    // Detect type
    if (selected.type.startsWith("image")) {
      setPreviewType("image");
    } else if (selected.type.startsWith("video")) {
      setPreviewType("video");
    } else {
      alert("❌ Only Images or Videos allowed!");
      return;
    }

    // Preview
    const previewUrl = URL.createObjectURL(selected);
    setPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      setMessage("❗ User not found. Please log in.");
      return;
    }

    if (!file) {
      setMessage("❗ Please select an image or video.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("text", text);
    formData.append("media", file);  // IMPORTANT: MUST MATCH BACKEND FIELD

    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/createPost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Post created successfully!");
      setText("");
      setFile(null);
      setPreview("");

      navigate(`/profile/${user.id}`);

    } catch (err) {
      console.error("Post creation error:", err);
      setMessage("❌ Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="col-12 col-md-8 col-lg-6">

        <div className="card shadow-sm">
          <div className="card-body">

            <h3 className="text-center fw-bold mb-3">Create New Post</h3>

            {message && (
              <div className="alert alert-info py-2 text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write a caption..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}  // FIXED 🔥
                ref={fileInputRef}
                style={{ display: "none" }}
              />

              <button
                type="button"
                className="btn btn-outline-primary w-100 mb-3"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fa-solid fa-arrow-up-from-bracket me-2"></i>
                {file ? "Change Media" : "Upload Image / Video"}
              </button>

              {/* Preview */}
              {preview && (
                <div className="mb-3 text-center">
                  {previewType === "image" ? (
                    <img
                      src={preview}
                      className="img-fluid rounded"
                      style={{ maxHeight: "350px", objectFit: "cover" }}
                      alt="img"
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="rounded"
                      style={{ width: "100%", maxHeight: "350px", objectFit: "cover" }}
                    ></video>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;
