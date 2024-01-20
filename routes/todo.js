const mongoose = require("mongoose");

// Define Todo schema
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  taskCompleted: {
    type: Boolean,
    default: false,
  },
});

// Create Todo model
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
