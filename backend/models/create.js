require('dotenv').config();
const mongoose = require('mongoose');



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the User Schema
const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "https://tse1.mm.bing.net/th?id=OIP.PoS7waY4-VeqgNuBSxVUogAAAA&pid=Api" }, // URL of profile image
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: { type: Number, default: 0 }, // Number of followers
  following: { type: Number, default: 0 }, // Number of followings
});

// Export the Model
module.exports = mongoose.model('User', userSchema);
