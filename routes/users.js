const plm = require("passport-local-mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User schema

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  todo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

// Add passport-local-mongoose plugin
userSchema.plugin(plm);

// Export User model
module.exports = mongoose.model("User", userSchema);
