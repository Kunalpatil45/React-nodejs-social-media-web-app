require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "https://tse1.mm.bing.net/th?id=OIP.PoS7waY4-VeqgNuBSxVUogAAAA&pid=Api" }, 
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: { type: Number, default: 0 }, 
  following: { type: Number, default: 0 }, 
});


module.exports = mongoose.model('User', userSchema);
