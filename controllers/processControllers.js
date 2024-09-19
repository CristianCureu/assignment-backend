import UserProcess from "../models/userProcessModel.js";
import Process from "../models/processModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getAllProcesses = async (req, res) => {
  try {
    const processes = await Process.find();
    res.json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProcessById = async (req, res) => {
  const { processId } = req.params;

  try {
    const process = await Process.findById(processId);
    res.json(process);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProcess = async (req, res) => {
  try {
    const existingProcess = await Process.findOne({ name: req.body.name });
    if (existingProcess) {
      return res.status(400).json({
        success: false,
        message: `Process with name ${req.body.name} already exists!`,
      });
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    const { id: userId } = jwt.decode(token);

    const user = await User.findById(userId);
    const process = await Process.create(req.body);

    await UserProcess.create({
      userId: user.id,
      processId: process.id,
    });

    res.status(201).json({
      success: true,
      message: `User ${user.email} assigned to process ${process.name}`,
      data: {
        id: process.id,
        name: process.name,
        color: process.color,
        private: process.private,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      Object.keys(error.errors).map((field) => ({
        success: false,
        field,
        message: error.errors[field].message,
      }));
      return res.status(400).json({ field, message });
    }

    res.status(500).json({ error: error.message });
  }
};
