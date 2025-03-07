const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
  likes: { type: [String], default: [null] }, // ✅ Default to 0 likes
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
