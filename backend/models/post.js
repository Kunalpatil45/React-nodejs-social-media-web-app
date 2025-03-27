const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    text: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
