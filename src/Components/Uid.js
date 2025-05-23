import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Uid.css";

const CreateUserId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [userIdAvailable, setUserIdAvailable] = useState(null);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const defaultProfileImage = "http://localhost:5000/default-user.png"; 
  const [preview, setPreview] = useState(defaultProfileImage); 


 
  const userData = location.state || {};

  useEffect(() => {
    if (userId.trim()) {
      const checkAvailability = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/check-userid/${userId}`);
          setUserIdAvailable(response.data.available);
        } catch (err) {
          console.error("❌ Error checking user ID:", err);
          setUserIdAvailable(null);
        }
      };

      const delayDebounce = setTimeout(checkAvailability, 500);
      return () => clearTimeout(delayDebounce);
    } else {
      setUserIdAvailable(null);
    }
  }, [userId]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setPreview(defaultProfileImage); 
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }
    if (!userIdAvailable) {
      setError("User ID is already taken. Please choose another.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("profileImage", profileImage || ""); 
    formData.append("userData", JSON.stringify(userData));

    try {
      const response = await axios.post("http://localhost:5000/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response status",response.status);

      if (response.status === 201) {
        console.log("✅ User registered successfully:", response.data);
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="Signup-container">
      <hr />
      <form onSubmit={handleSubmit}>
        <h2>Upload Profile Picture</h2>
        <div className="profilepreview">
          <img src={preview}  height={150} width={150} />
        </div>
        <input type="file" accept="image/*" className="profilebtn" onChange={handleFileChange} style={{ display: "none" }} id="fileInput" />
        <button type="button" onClick={() => document.getElementById("fileInput").click()}>Upload Profile Picture</button>
        <br />

        <h1>Create Your User ID</h1>
        <input className="ids-inputs" type="text" placeholder="Choose a unique User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        {userId && (
          <p className={`user-id-status ${userIdAvailable ? "available" : "taken"}`}>
            {userIdAvailable === null ? "Checking availability..." : userIdAvailable ? "✅ User ID is available" : "❌ User ID is taken"}
          </p>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateUserId;
