import Task from "../models/taskModel.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("person");

    const groupedTasks = tasks.reduce((acc, task) => {
      const status = task.status || "to-do";
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});

    res.json(groupedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found!`,
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMultipleTasks = async (req, res) => {
  const tasks = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of tasks to create.",
    });
  }

  try {
    const tasksToInsert = [];

    for (const task of tasks) {
      const { title, person } = task;

      const existingTask = await Task.findOne({ title, person });

      if (existingTask) {
        continue;
      }

      tasksToInsert.push(task);
    }

    if (tasksToInsert.length > 0) {
      const createdTasks = await Task.insertMany(tasksToInsert);
      res.status(201).json({
        success: true,
        message: `${createdTasks.length} tasks were created successfully!`,
        data: createdTasks,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No tasks were created due to duplicates.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
