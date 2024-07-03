const mongoose = require("mongoose");

//Create Schema
const profilePictureSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const ProfilePicture = mongoose.model("ProfilePicture", profilePictureSchema);

module.exports = ProfilePicture;
