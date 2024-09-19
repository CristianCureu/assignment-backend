import mongoose from "mongoose";

const userProcessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  processId: { type: mongoose.Schema.Types.ObjectId, ref: "Process", required: true },
  assigneDate: { type: Date, default: Date.now },
});

userProcessSchema.index({ userId: 1, processId: 1 }, { unique: true });

const UserProcess = mongoose.model("UserProcess", userProcessSchema);

export default UserProcess;
