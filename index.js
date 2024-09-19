import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import userProcessRoutes from "./routes/userProcessRoutes.js";
import processRoutes from "./routes/processRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/process", processRoutes);
app.use("/api/assignments", userProcessRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/task", taskRoutes);

const main = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://cureuncristian:4DQJMxUy7E8nRSTy@cluster0.p4gyp.mongodb.net/assignment_list?retryWrites=true&w=majority&appName=Cluster0"
    );

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
};

main();
