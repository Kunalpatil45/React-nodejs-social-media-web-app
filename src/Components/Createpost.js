import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const CreatePost = () => {
  const { user } = useContext(UserContext);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      setMessage("❗ User not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("text", text);

    if (image) formData.append("image", image);

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
      setImage(null);
      setPreview("");

      navigate("/profile/" + user.id);
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

              {/* Caption Textarea */}
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
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />

              {/* Upload Button */}
              <button
                type="button"
                className="btn btn-outline-primary w-100 mb-3"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fa-solid fa-arrow-up-from-bracket me-2"></i>
                Upload Image
              </button>

              {/* Image Preview */}
              {preview && (
                <div className="mb-3 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "350px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Submit Button */}
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
