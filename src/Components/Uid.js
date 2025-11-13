import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CreateUserId = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState("");
  const [userIdAvailable, setUserIdAvailable] = useState(null);
  const [error, setError] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const defaultProfileImage = `${process.env.REACT_APP_API_URL}/default-user.png`;
  const [preview, setPreview] = useState(defaultProfileImage);

  const userData = location.state || {};

  // 🔍 Debounced UserID Availability Check
  useEffect(() => {
    if (!userId.trim()) {
      setUserIdAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/check-userid/${userId}`
        );
        setUserIdAvailable(res.data.available);
      } catch (err) {
        console.error("UserID Check Error:", err);
        setUserIdAvailable(null);
      }
    };

    const delay = setTimeout(checkAvailability, 500);
    return () => clearTimeout(delay);
  }, [userId]);

  // 📸 Profile Image Preview
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

  // 📤 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }
    if (!userIdAvailable) {
      setError("User ID is already taken.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("profileImage", profileImage || "");
    formData.append("userData", JSON.stringify(userData));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container d-flex justify-content-center py-5">
      <div className="col-12 col-md-8 col-lg-5">

        <div className="card shadow-sm p-4">
          <h3 className="fw-bold text-center mb-3">Set Up Your Profile</h3>
          <hr />

          <form onSubmit={handleSubmit}>

            {/* Profile Image Preview */}
            <div className="text-center mb-3">
              <img
                src={preview}
                alt="Profile Preview"
                className="rounded-circle border"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="uploadInput"
              style={{ display: "none" }}
            />

            {/* Upload Button */}
            <button
              type="button"
              className="btn btn-outline-primary w-100 mb-4"
              onClick={() => document.getElementById("uploadInput").click()}
            >
              Upload Profile Picture
            </button>

            {/* User ID Field */}
            <h5 className="fw-semibold">Create Your User ID</h5>

            <input
              type="text"
              className="form-control mt-2"
              placeholder="Choose a unique User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            {/* Live Availability Indicator */}
            {userId && (
              <p
                className={`mt-2 mb-0 fw-semibold ${
                  userIdAvailable
                    ? "text-success"
                    : userIdAvailable === null
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {userIdAvailable === null
                  ? "Checking availability..."
                  : userIdAvailable
                  ? "✅ Username available"
                  : "❌ Username taken"}
              </p>
            )}

            {error && (
              <p className="text-danger fw-semibold small mt-2">{error}</p>
            )}

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100 mt-4">
              Finish
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserId;
