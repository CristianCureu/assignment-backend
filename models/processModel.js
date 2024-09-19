import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  color: { type: String, required: true },
  private: { type: Boolean, required: true, default: false },
});

const Process = mongoose.model("Process", processSchema);

export default Process;
