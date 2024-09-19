import UserProcess from "../models/userProcessModel.js";
import User from "../models/userModel.js";
import Process from "../models/processModel.js";

export const getProcessesForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userProcesses = await UserProcess.find({ userId }).populate("processId");

    const processes = userProcesses.map((up) => {
      const process = up.processId.toObject();
      const { _id, ...rest } = process;
      return {
        id: _id.toString(),
        ...rest,
      };
    });

    res.json(processes);
  } catch (error) {
    console.error("Error fetching processes for user:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUsersForProcess = async (req, res) => {
  const { processId } = req.params;

  try {
    const processUsers = await UserProcess.find({ processId }).populate("userId");

    const processes = processUsers.map((up) => up.userId);

    res.json(processes);
  } catch (error) {
    console.error("Error fetching processes for user:", error);
    res.status(500).json({ error: error.message });
  }
};

export const assignUserToProcess = async (req, res) => {
  const { email, userId, processId } = req.body;

  try {
    let user;

    if (email) {
      user = await User.findOne({ email });
    } else if (userId) {
      user = await User.findById(userId);
    }
    const process = await Process.findById(processId);

    if (!user || !process) {
      return res.status(404).json({ error: "User or Process not found" });
    }

    const userProcess = new UserProcess({
      userId: user.id,
      processId,
    });

    await userProcess.save();
    res.status(201).json(userProcess);
  } catch (error) {
    console.error("Error assigning user to process:", error);
    res.status(500).json({ error: error.message });
  }
};

export const removeUserFromProcess = async (req, res) => {
  const { userId, processId } = req.body;

  try {
    const userProcess = await UserProcess.findOneAndDelete({ userId, processId });

    if (!userProcess) {
      return res.status(404).json({ error: "UserProcess association not found" });
    }

    res.status(200).json({ message: "User removed from process successfully" });
  } catch (error) {
    console.error("Error removing user from process:", error);
    res.status(500).json({ error: error.message });
  }
};
