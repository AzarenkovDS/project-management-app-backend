import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

const isProjectOwner = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id." });
    }

    // Authorization check
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to access this project." });
    }

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Server error" });
  }
};

const isTaskOwner = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "No task found with this id." });
    }

    // Authorization check
    if (task.project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to access this task." });
    }

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/:projectId/tasks - Get all tasks for a specific project
router.get("/projects/:projectId/tasks", isProjectOwner, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });

    res.json(tasks);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/projects/:projectId/tasks - Create a new task for a specific project
router.post("/projects/:projectId/tasks", isProjectOwner, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,

      project: req.params.projectId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT /api/tasks/:taskId - Update a single task
router.put("/tasks/:taskId", isTaskOwner, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    });

    res.json({ task });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:taskId - Delete a single task
router.delete("/tasks/:taskId", isTaskOwner, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: "Task deleted." });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
