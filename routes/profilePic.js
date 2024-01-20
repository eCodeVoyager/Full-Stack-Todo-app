const mongoose = require("mongoose");

const profilePictureSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    default:
      "https://image.lexica.art/full_jpg/80c843eb-1aa9-453b-b8bd-ecc86fd232da", // Path to your default profile picture
  },
  customPicture: {
    type: Boolean,
    default: false,
  },
});

const profilePicture = mongoose.model("ProfilePicture", profilePictureSchema);

module.exports = profilePicture;
