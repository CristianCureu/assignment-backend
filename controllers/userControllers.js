import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(400).json({ success: false, message: "User not found!" });

    res.json({
      _id: user.id,
      workspace: user.workspace,
      name: user.name,
      surname: user.surname,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserById = async (req, res) => {
  const { userId } = req.params;
  const { name, surname, email, password, avatar } = req.body;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return res.status(400).json({ success: false, message: "User not found!" });

    res.json({
      _id: updatedUser.id,
      workspace: updatedUser.workspace,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
