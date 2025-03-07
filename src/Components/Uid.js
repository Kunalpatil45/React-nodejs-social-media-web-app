import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CreateUserId = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  
  // Retrieve user data from previous page
  const userData = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        ...userData,
        userId,
      });
      
      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        navigate("/upload-profile", { state: { userId } }); // Redirect to profile pic page
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="Signup-container">
      <h1>Create Your User ID</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <input
          className="ids-inputs"
          type="text"
          placeholder="Choose a unique User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateUserId;
