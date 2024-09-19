import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "VerySecretKey";
const JWT_REFRESH_SECRET = "AnotherVerySecretKey";

export const register = async (req, res) => {
  const { workspace, name, surname, email, password } = req.body;

  if (!workspace || !name || !surname || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists." });

    const user = new User({ workspace, name, surname, email, password });
    await user.save();

    jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      success: true,
      message: "Account was successfully created!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message,
      }));
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: { _id: user.id, email: user.email, name: user.name, surname: user.surname },
    });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ success: false, message: "Refresh token required" });

  try {
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ success: false, message: "Invalid refresh token" });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ success: true, token });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
