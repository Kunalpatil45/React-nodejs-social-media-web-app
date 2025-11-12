import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./createpost.css";


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
      setMessage("User not found. Please log in.");
      console.log("User missing in CreatePost:", user); 
      return;
    }

    

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/createPost`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Post created successfully!");
      setText("");
      setImage(null);
      setPreview("");
      navigate("/profile/" + user.id);
    } catch (err) {
      console.error("Post creation error:", err.response?.data || err.message);
      setMessage("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Create Post</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Caption Here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }} 
        />

        
        <button
          type="button"
          className="upload-btn"
          onClick={() => fileInputRef.current.click()} 
        >
         <i class="fa-solid fa-arrow-up-from-bracket"></i> Upload Image
        </button>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
