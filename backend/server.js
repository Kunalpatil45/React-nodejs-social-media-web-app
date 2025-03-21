const express = require('express');
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const cors = require('cors');
const User = require('./models/create');
const Post = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(express.static("public"));
const multer = require("multer");
app.use(express.json()); // ✅ Parses JSON body
app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded data
app.use("/uploads", express.static("uploads"));
const path = require("path");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(fileUpload({
  useTempFiles: true
}))


// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend URL
  credentials: true, // Allow cookies/session
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

// Signup Route
app.post('/signup', async (req, res) => {
  console.log("Incoming signup request:", req.body);

  let { userId, userData } = req.body;

  if (!userId || !userData) {
      return res.status(400).json({ error: "User data and userId are required" });
  }

  try {
      userData = JSON.parse(userData);

      if (userData.userData) {
          userData = userData.userData;
      }
  } catch (error) {
      return res.status(400).json({ error: "Invalid userData format" });
  }

  let { Name, email, dob, password, gender } = userData;

  if (!Name || !email || !dob || !password || !gender) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      let existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "User already exists" });

      let profileImageUrl = "/default-profile.png"; // Default image path

      // ✅ Handle profile image upload if provided
      if (req.files && req.files.profileImage) {
          const result = await cloudinary.uploader.upload(req.files.profileImage.tempFilePath, {
              folder: "profiles", // Cloudinary folder
              use_filename: true,
          });

          console.log("Cloudinary Upload Success:", result);
          profileImageUrl = result.secure_url; // Save Cloudinary URL
      }

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
              let newUser = new User({
                  userId,
                  Name,
                  email,
                  dob,
                  gender,
                  password: hash,
                  profileImage: profileImageUrl, // Store Cloudinary URL
              });

              const savedUser = await newUser.save();
              res.status(201).json({ message: "User registered!", userId: savedUser.userId });
          });
      });

  } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Internal server error" });
  }
});






app.post("/signin", async (req, res) => {
  try {
     // Debugging log
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, userId: user.id }, "maihudon", { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: false });
    
    
    
    res.status(200).json({
      message: "Login successful",
      
      user: {
        id: user.userId,
        email: user.email,
        name: user.Name,
        profileImage: user.profileImage,
        gender: user.gender,
      },
    
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user/details", async (req, res) => {
  
  const userId = req.user.id; // Get logged-in user's ID (Assuming you use authentication)
  const user = await User.findById(userId);
  res.json(user);
});


app.post("/logout", (req, res) => {
  res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ true in production (HTTPS)
      sameSite: "Strict",
  });

  res.json({ message: "Logout successful" });
});



app.get("/user/details", async (req, res) => {
  const userId = req.user.id; // Get logged-in user's ID (Assuming you use authentication)
  const user = await User.findById(userId);
  res.json(user);
});


app.get("/check-userid/:userId", async (req, res) => {
  const { userId } = req.params;
  const existingUser = await User.findOne({ userId });
  res.json({ available: !existingUser });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ true in production (HTTPS)
      sameSite: "Strict",
  });

  res.json({ message: "Logout successful" });
});

app.get("/searchUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ userId: { $regex: userId, $options: "i" } }); // Case-insensitive search
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});



app.post("/createPost", async (req, res) => {
  try {
    console.log("Received Post Request");
    console.log("Request Body:", req.body);

    const { userId, text } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // ✅ Upload Image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: "posts", // Cloudinary folder
      use_filename: true,
    });

    console.log("Cloudinary Upload Success:", result);
    const imageUrl = result.secure_url;

    // ✅ Save Post in MongoDB
    const newPost = new Post({
      userId,
      text,
      likes: 0,
      image: imageUrl, // Save Cloudinary Image URL
    });

    const savedPost = await newPost.save();
    console.log("✅ Post created successfully:", savedPost);

    // ✅ Update User's Posts Array
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId }, // Find user by userId
      { $push: { posts: savedPost._id } }, // Add post ID to posts array
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      console.error("❌ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User updated successfully:", updatedUser);
    res.status(201).json({ post: savedPost, user: updatedUser });

  } catch (err) {
    console.error("❌ Post creation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/posts", async (req, res) => {
  try {
    // Fetch all posts from the database, sorted by newest first
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }).populate("posts"); // ✅ Populate posts

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all posts of a user
app.get("/getUserPosts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/likePost", async (req, res) => {
  try {
    const { postId, userId } = req.body;
    console.log("Like Request:", req.body);
    if (!postId || !userId) {
      return res.status(400).json({ message: "Post ID and User ID are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      // If user already liked, remove their ID (Unlike)
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      // Else, add user ID (Like)
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes }); // Send updated likes array
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("Requested user ID:", userId);

  try {
      // 🔥 Fix: Use `findOne({ userId: userId })` instead of `findById(userId)`
      const user = await User.findOne({ userId: userId });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      console.log(user);
      res.json(user);
  } catch (error) {
      console.error("Profile Route Error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});




// Root Route
app.get('/', (req, res) => {
  res.send("Hello World!");
}); 




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




