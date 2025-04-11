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
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/uploads", express.static("uploads"));
const path = require("path");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

app.use(express.static("public")); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(fileUpload({
  useTempFiles: true
}))



app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));


app.post("/signup", async (req, res) => {
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
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    let profileImageUrl = "/default_user.png"; 

  
    if (req.files && req.files.profileImage) {
      try {
        const result = await cloudinary.uploader.upload(req.files.profileImage.tempFilePath, {
          folder: "profiles",
          use_filename: true,
        });

        
        profileImageUrl = result.secure_url; 
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Failed:", uploadError);
      }
    }

   
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let newUser = new User({
          userId,
          Name,
          email,
          dob,
          gender,
          password: hash,
          profileImage: profileImageUrl, 
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered!", userId: savedUser.userId });
      });
    });

  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/default_user.png", (req, res) => {
  res.sendFile(__dirname + "/public/default_user.png"); 
});


app.post("/signin", async (req, res) => {
  try {
     
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
  
  const userId = req.user.id; 
  const user = await User.findById(userId);
  res.json(user);
});


app.post("/logout", (req, res) => {
  res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",
  });

  res.json({ message: "Logout successful" });
});



app.get("/user/details", async (req, res) => {
  const userId = req.user.id; 
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
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",
  });

  res.json({ message: "Logout successful" });
});

app.get("/searchUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ userId: { $regex: userId, $options: "i" } }); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});



app.post("/createPost", async (req, res) => {
  try {
    console.log("📩 Received Post Request:", req.body);

    const { userId, text } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!text) return res.status(400).json({ error: "Post text is required" });
    if (!req.files || !req.files.image) return res.status(400).json({ error: "Image file is required" });

    
    const user = await User.findOne({ userId }); 
    if (!user) return res.status(404).json({ error: "User not found" });

    
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: "posts",
      use_filename: true,
    });

    console.log("☁️ Cloudinary Upload Success:", result);
    const imageUrl = result.secure_url;

    
    const newPost = new Post({
      userId: user._id, 
      text,
      image: imageUrl,
    });

    const savedPost = await newPost.save();
    console.log("✅ Post Created Successfully:", savedPost);

  
    await User.findByIdAndUpdate(user._id, { $push: { posts: savedPost._id } });

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Post Creation Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/recent-users", async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 }) 
      .limit(5)
      .select("userId profileImage"); 

    res.status(200).json(recentUsers);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/posts", async (req, res) => {
  try {
    
    const posts = await Post.find()
      .populate("userId", "profileImage Name") 
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }).populate("posts"); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



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

app.delete("/deletePost/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

  
    await User.findOneAndUpdate(
      { userId: deletedPost.userId }, 
      { $pull: { posts: postId } }
    );

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("Requested user ID:", userId);

  try {
      
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





app.get('/', (req, res) => {
  res.send("Hello World!");
}); 





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




