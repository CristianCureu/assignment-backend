import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
    required: true,
  },
  priority: {
    type: String,
    enum: ["urgent", "high", "medium", "low"],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  person: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["to-do", "in-progress", "review", "completed"],
    default: "to-do",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
