const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
  
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
