import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/projects - Get all projects for the logged-in user
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });

    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/projects - Create a new project
router.post("/", async (req, res) => {
  try {
    const user = req.user;

    const project = await Project.create({
      ...req.body,
      // The user ID needs to be added here
      user: user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET /api/projects/:id - Get a project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id." });
    }

    // Authorization check
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this project." });
    }

    res.json({ project });
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT /api/projects/:id - Update a project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id." });
    }

    // Authorization check
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this project." });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({ project: updatedProject });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

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
        .json({ message: "User is not authorized to update this project." });
    }

    await Project.findByIdAndDelete(projectId);

    await Task.deleteMany({ project: projectId });

    res.json({ message: "Project and related tasks deleted." });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
