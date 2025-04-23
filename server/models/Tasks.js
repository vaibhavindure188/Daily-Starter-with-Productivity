const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  email: { type: String, required: true }, // User identifier
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  tasks: [
    {
      description: { type: String, required: true },
      done: { type: Boolean, default: false },
    },
  ],
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
